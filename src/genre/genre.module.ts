import { Module } from "@nestjs/common";
import { GenreController } from "./genre.controller";
import { GenreService } from "./genre.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Genre, GenreSchema } from "./genre.model";
import { MovieModule } from "src/movie/movie.module";

@Module({
  controllers: [GenreController],
  providers: [GenreService],
  imports: [
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
    MovieModule,
  ],
})
export class GenreModule {}
