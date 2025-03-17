import { IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  email: string;

  password?: string;

  isAdmin?: boolean;
}
