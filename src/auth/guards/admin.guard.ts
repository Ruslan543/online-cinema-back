import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserDocument } from "src/user/user.model";

export class OnlyAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<{ user: UserDocument }>();
    const { user } = request;

    if (!user.isAdmin) {
      throw new ForbiddenException("You have no rights!");
    }

    return user.isAdmin;
  }
}
