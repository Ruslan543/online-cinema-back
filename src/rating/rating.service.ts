import { Injectable } from "@nestjs/common";
import { Rating, RatingDocument, RatingModel } from "./rating.model";
import { InjectModel } from "@nestjs/mongoose";
import { MovieService } from "src/movie/movie.service";
import { Types } from "mongoose";
import { SetRatingDto } from "./dto/set-rating.dto";

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name)
    private readonly RatingModel: RatingModel,

    private readonly movieService: MovieService,
  ) {}

  async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
    const data = await this.RatingModel.findOne({ movieId, userId })
      .select("value")
      .exec();

    return data ? data.value : 0;
  }

  async averageRatingByMovie(movieId: Types.ObjectId | string) {
    const ratingsMovie: RatingDocument[] = await this.RatingModel.aggregate([
      {
        $match: { movie: movieId },
      },
    ]).exec();

    const average =
      ratingsMovie.reduce((acc, rating) => acc + rating.value, 0) /
      ratingsMovie.length;

    const averageRounded = Math.round(average * 10) / 10;
    return averageRounded;
  }

  async setRating(userId: Types.ObjectId, dto: SetRatingDto) {
    const { movie, value } = dto;
    await this.movieService.byId(String(movie));

    const newRating = await this.RatingModel.findOneAndUpdate(
      { movie, user: userId },
      {
        value,
        movie,
        user: userId,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    ).exec();

    const averageRating = await this.averageRatingByMovie(movie);
    await this.movieService.updateRating(movie, averageRating);

    return newRating;
  }
}
