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
import { ActorService } from "./actor.service";
import { Auth } from "src/auth/decorators/auth.decorator";
import { ActorDto } from "./actor.dto";
import { IdValidationPipe } from "src/pipes/id.validation.pipe";

@Controller("actors")
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @HttpCode(200)
  @Get("by-slug/:slug")
  async bySlug(@Param("slug") slug: string) {
    return this.actorService.bySlug(slug);
  }

  @HttpCode(200)
  @Get()
  async getAll(@Query("searchTerm") searchTerm?: string) {
    return this.actorService.getAll(searchTerm);
  }

  @HttpCode(200)
  @Get(":id")
  @Auth("admin")
  async getActor(@Param("id", IdValidationPipe) id: string) {
    return this.actorService.byId(id);
  }

  @HttpCode(200)
  @Post()
  @Auth("admin")
  async create() {
    return this.actorService.create();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(":id")
  @Auth("admin")
  async updateActor(
    @Param("id", IdValidationPipe) id: string,
    @Body() dto: ActorDto,
  ) {
    return this.actorService.update(id, dto);
  }

  @HttpCode(200)
  @Delete(":id")
  @Auth("admin")
  async deleteActor(@Param("id", IdValidationPipe) id: string) {
    return this.actorService.delete(id);
  }
}
