import { createParamDecorator } from "@nestjs/common";
import { UserDocument } from "src/user/user.model";

export type TypeData = keyof UserDocument;

export const User = createParamDecorator(
  (data: TypeData | undefined, contex) => {
    const { user } = contex.switchToHttp().getRequest<{ user: UserDocument }>();
    return data ? user[data] : user;
  },
);
