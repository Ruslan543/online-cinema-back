import { Model } from "mongoose";
import {
  BadRequestException,
  Injectable,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { hash, compare, genSalt } from "bcryptjs";
// import { ModelType } from "@typegoose/typegoose/lib/types";
// import { InjectModel } from "nestjs-typegoose";

import { UserDocument, User, UserModel } from "../user/user.model";
import { AuthDto } from "./dto/auth.dto";
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt";
import { RefreshTokenDto } from "./dto/refreshToken.dto";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

// type ReturnType = { user: User } & Tokens;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: UserModel,
    private readonly jwtService: JwtService,
  ) {}
  // @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>, // @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,

  async register(dto: AuthDto) {
    const oldUser = await this.UserModel.findOne({ email: dto.email });

    if (oldUser) {
      throw new BadRequestException(
        "User with email is already in the system!",
      );
    }

    // const salt = await genSalt(10);
    // const password = await hash(dto.password, salt);

    const password = await this.UserModel.hashingPassword(dto.password);
    const newUser = await this.UserModel.create({
      email: dto.email,
      password,
    });

    const tokens = await this.issueTokenPair(newUser._id.toString());

    return {
      user: this.returnUserFields(newUser),
      ...tokens,
    };
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.issueTokenPair(user._id.toString());

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async validateUser(dto: AuthDto): Promise<UserDocument> {
    const { email, password } = dto;
    const user = await this.UserModel.findOne({ email });

    const isValidUser = user && (await compare(password, user.password));

    if (!isValidUser) {
      throw new UnauthorizedException("Incorrect login or password!");
    }

    return user;
  }

  async issueTokenPair(userId: string): Promise<Tokens> {
    const data = { _id: userId };

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: "15d",
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: "1d",
    });

    return { accessToken, refreshToken };
  }

  returnUserFields(user: UserDocument) {
    return {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }

  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) throw new UnauthorizedException("Please sign in!");

    const decoded = await this.jwtService.verifyAsync(refreshToken);
    if (!decoded) throw new UnauthorizedException("Invalid token or expired!");

    const user = await this.UserModel.findById(decoded._id);

    if (!user) {
      throw new UnauthorizedException(
        "The user belonging to this token does not exist!",
      );
    }

    if (this.changedPasswordAfter(user, decoded.iat)) {
      throw new UnauthorizedException(
        "User has changed password! Please login again",
      );
    }

    const tokens = await this.issueTokenPair(user._id.toString());
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  changedPasswordAfter(user: UserDocument, jwtTimestamp: number) {
    if (!user.passwordChangedAt) return false;

    const changedTimestamp = parseInt(
      String(user.passwordChangedAt.getTime() / 1000),
      10,
    );

    return jwtTimestamp < changedTimestamp;
  }
}
