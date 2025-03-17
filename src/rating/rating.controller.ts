import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Types } from "mongoose";
import { Auth } from "src/auth/decorators/auth.decorator";
import { User } from "src/user/decorators/user.decorator";
import { IdValidationPipe } from "src/pipes/id.validation.pipe";
import { RatingService } from "./rating.service";
import { SetRatingDto } from "./dto/set-rating.dto";

@Controller("ratings")
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @HttpCode(200)
  @Get(":movieId")
  @Auth()
  async getMovieValueByUser(
    @Param("movieId", IdValidationPipe) movieId: Types.ObjectId,
    @User("_id") _id: Types.ObjectId,
  ) {
    return this.ratingService.getMovieValueByUser(movieId, _id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("set-rating")
  @Auth()
  async setRating(@User("_id") _id: Types.ObjectId, @Body() dto: SetRatingDto) {
    return this.ratingService.setRating(_id, dto);
  }
}
