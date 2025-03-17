import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Movie, MovieModel } from "./movie.model";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { Types } from "mongoose";
import { TelegramService } from "src/telegram/telegram.service";

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name)
    private readonly MovieModel: MovieModel,

    private readonly telegramService: TelegramService,
  ) {}

  async getAll(searchTerm?: string) {
    const option = {};

    if (searchTerm) {
      option["$or"] = [{ title: new RegExp(searchTerm, "i") }];
    }

    const movies = await this.MovieModel.find(option)
      .select("-updatedAt -__v")
      .sort({ createAt: "desc" })
      .populate("actors genres")
      .exec();

    return movies;
  }

  async bySlug(slug: string) {
    const movie = await this.MovieModel.findOne({ slug })
      .populate("actors genres")
      .exec();

    if (!movie) throw new NotFoundException("Movie not found");
    return movie;
  }

  async byActor(actorId: Types.ObjectId) {
    const movie = await this.MovieModel.find({ actors: actorId }).exec();
    if (!movie) throw new NotFoundException("Movies not found");

    return movie;
  }

  async byGenres(genreIds: Types.ObjectId[]) {
    const movies = await this.MovieModel.find({
      genres: { $in: genreIds },
    }).exec();

    return movies;
  }

  async getMostPopular() {
    const movies = await this.MovieModel.find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate("genres")
      .exec();

    return movies;
  }

  async updateCountOpened(slug: string) {
    const movie = await this.MovieModel.findOneAndUpdate(
      { slug },
      {
        $inc: { countOpened: 1 },
      },
      {
        runValidators: true,
        new: true,
      },
    ).exec();

    if (!movie) {
      throw new NotFoundException("Movie not found");
    }

    return movie;
  }

  async updateRating(id: Types.ObjectId, newRating: number) {
    const movie = await this.MovieModel.findByIdAndUpdate(
      id,
      { rating: newRating },
      { new: true, runValidators: true },
    ).exec();

    return movie;
  }

  /* Admin place */

  async byId(_id: string) {
    const movie = await this.MovieModel.findById(_id);
    if (!movie) throw new NotFoundException("Movie not found");

    return movie;
  }

  async create() {
    const defaultMovie: UpdateMovieDto = {
      bigPoster: "",
      poster: "",
      title: "",
      slug: "",
      videoUrl: "",
      genres: [],
      actors: [],
    };

    const movie = await this.MovieModel.create(defaultMovie);
    return movie._id;
  }

  async update(_id: string, dto: UpdateMovieDto) {
    // if (!dto.isSendTelegram) {
    //   await this.sendNotification(dto);
    //   dto.isSendTelegram = true;
    // }

    const movie = await this.MovieModel.findByIdAndUpdate(_id, dto, {
      runValidators: true,
      new: true,
    }).exec();

    if (!movie) {
      throw new NotFoundException("Movie not found");
    }

    return movie;
  }

  async delete(_id: string) {
    const movie = await this.MovieModel.findByIdAndDelete(_id).exec();
    if (!movie) throw new NotFoundException("Movie not found");

    return null;
  }

  async sendNotification(dto: UpdateMovieDto) {
    if (process.env.NODE_ENV !== "development") {
      await this.telegramService.sendPhoto(dto.poster);
    }

    const message = `<b>${dto.title}</b>`;
    await this.telegramService.sendMessage(message, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              url: "https://okko.tv/movie/free-guy",
              text: "🍿 Go to watch",
            },
          ],
        ],
      },
    });
  }
}
