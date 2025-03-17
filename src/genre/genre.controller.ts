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
import { GenreService } from "./genre.service";
import { IdValidationPipe } from "src/pipes/id.validation.pipe";
import { CreateGenreDto } from "./dto/createGenre.dto";
import { Auth } from "src/auth/decorators/auth.decorator";

@Controller("genres")
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @HttpCode(200)
  @Get("by-slug/:slug")
  async bySlug(@Param("slug") slug: string) {
    return this.genreService.bySlug(slug);
  }

  @HttpCode(200)
  @Get("collections")
  async getCollections() {
    return this.genreService.getCollections();
  }

  @HttpCode(200)
  @Get()
  async getAll(@Query("searchTerm") searchTerm?: string) {
    return this.genreService.getAll(searchTerm);
  }

  @HttpCode(200)
  @Get(":id")
  @Auth("admin")
  async getGenre(@Param("id", IdValidationPipe) id: string) {
    return this.genreService.byId(id);
  }

  @HttpCode(200)
  @Post()
  @Auth("admin")
  async create() {
    return this.genreService.create();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(":id")
  @Auth("admin")
  async updateGenre(
    @Param("id", IdValidationPipe) id: string,
    @Body() dto: CreateGenreDto,
  ) {
    return this.genreService.update(id, dto);
  }

  @HttpCode(200)
  @Delete(":id")
  @Auth("admin")
  async deleteGenre(@Param("id", IdValidationPipe) id: string) {
    return this.genreService.delete(id);
  }
}
