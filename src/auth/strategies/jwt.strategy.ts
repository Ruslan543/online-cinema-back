import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User, UserDocument } from "src/user/user.model";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name)
    private readonly UserModel: Model<UserDocument>,
  ) {
    const jwtSecret = configService.get("JWT_SECRET");
    if (!jwtSecret) {
      throw new Error("JWT_SECRET не задан в .env");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: Pick<UserDocument, "_id">) {
    return this.UserModel.findById(payload._id).exec();
  }
}
