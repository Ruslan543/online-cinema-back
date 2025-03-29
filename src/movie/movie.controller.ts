import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Auth } from "src/auth/decorators/auth.decorator";
import { IdValidationPipe } from "src/pipes/id.validation.pipe";
import { MovieService } from "./movie.service";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { Types } from "mongoose";
import { GenreIdsDto } from "./dto/genreIds.dto";
import { SlugValidationPipe } from "./pipes/slug.validation";

@Controller("movies")
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @HttpCode(200)
  @Get("by-slug/:slug")
  async bySlug(@Param("slug") slug: string) {
    return this.movieService.bySlug(slug);
  }

  @HttpCode(200)
  @Get("by-actor/:actorId")
  async byActor(
    @Param("actorId", IdValidationPipe.toObjectId()) actorId: Types.ObjectId,
  ) {
    return this.movieService.byActor(actorId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("by-genres")
  async byGenres(@Body() { genreIds }: GenreIdsDto) {
    return this.movieService.byGenres(genreIds);
  }

  @HttpCode(200)
  @Get("most-popular")
  async getMostPopular() {
    return this.movieService.getMostPopular();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put("update-count-opened")
  async updateCountOpened(@Body("slug", SlugValidationPipe) slug: string) {
    return this.movieService.updateCountOpened(slug);
  }

  @HttpCode(200)
  @Get()
  async getAll(@Query("searchTerm") searchTerm?: string) {
    return this.movieService.getAll(searchTerm);
  }

  @HttpCode(200)
  @Get(":id")
  @Auth("admin")
  async getMovie(@Param("id", IdValidationPipe) id: string) {
    return this.movieService.byId(id);
  }

  @HttpCode(200)
  @Post()
  @Auth("admin")
  async create() {
    return this.movieService.create();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(":id")
  @Auth("admin")
  async updateMovie(
    @Param("id", IdValidationPipe) id: string,
    @Body() dto: UpdateMovieDto,
  ) {
    return this.movieService.update(id, dto);
  }

  @HttpCode(200)
  @Delete(":id")
  @Auth("admin")
  async deleteMovie(@Param("id", IdValidationPipe) id: string) {
    return this.movieService.delete(id);
  }
}
