import { UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException("Token is invalid or missing!");
    }

    return user;
  }
}
