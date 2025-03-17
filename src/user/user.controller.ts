import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Auth } from "src/auth/decorators/auth.decorator";
import { UserService } from "./user.service";
import { User } from "src/user/decorators/user.decorator";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { IdValidationPipe } from "src/pipes/id.validation.pipe";
import { Types } from "mongoose";
import { UserDocument } from "./user.model";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @Get("profile")
  @Auth()
  async getProfile(@User("_id") _id: string) {
    return this.userService.getById(_id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put("profile")
  @Auth()
  async updateProfile(@User("_id") _id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(_id, dto);
  }

  @HttpCode(200)
  @Get("profile/favorites")
  @Auth()
  async getFavorites(@User("_id") _id: Types.ObjectId) {
    return this.userService.getFavoriteMovies(_id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put("profile/favorites")
  @Auth()
  async toggleFavorite(
    @Body("movieId", IdValidationPipe) movieId: Types.ObjectId,
    @User() user: UserDocument,
  ) {
    return this.userService.toggleFavorite(movieId, user);
  }

  @HttpCode(200)
  @Get("count")
  @Auth("admin")
  async getCountUsers() {
    return this.userService.getCount();
  }

  @HttpCode(200)
  @Get()
  @Auth("admin")
  async getAll(@Query("searchTerm") searchTerm?: string) {
    return this.userService.getAll(searchTerm);
  }

  @HttpCode(200)
  @Get(":id")
  @Auth("admin")
  async getUser(@Param("id", IdValidationPipe) id: string) {
    return this.userService.getById(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(":id")
  @Auth("admin")
  async updateUser(
    @Param("id", IdValidationPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(id, dto);
  }

  @HttpCode(204)
  @Delete(":id")
  @Auth("admin")
  async deleteUser(@Param("id", IdValidationPipe) id: string) {
    return this.userService.delete(id);
  }
}
