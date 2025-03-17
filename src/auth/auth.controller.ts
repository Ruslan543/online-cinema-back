import {
  Get,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  HttpCode,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { User } from "src/user/user.model";
import { RefreshTokenDto } from "./dto/refreshToken.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("register")
  async register(@Body() dto: AuthDto) {
    const user = this.AuthService.register(dto);
    return user;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("login")
  async login(@Body() dto: AuthDto) {
    const user = this.AuthService.login(dto);
    return user;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("login/access-token")
  async getNewTokens(@Body() dto: RefreshTokenDto) {
    return this.AuthService.getNewTokens(dto);
  }
}
