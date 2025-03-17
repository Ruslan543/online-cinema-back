import { Module } from "@nestjs/common";
import { MovieService } from "./movie.service";
import { MovieController } from "./movie.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Movie, MovieSchema } from "./movie.model";
import { TelegramModule } from "src/telegram/telegram.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    TelegramModule,
  ],
  providers: [MovieService],
  controllers: [MovieController],
  exports: [MovieService],
})
export class MovieModule {}
