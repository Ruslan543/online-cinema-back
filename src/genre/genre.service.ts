import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Genre, GenreDocument, GenreModel } from "./genre.model";
import { CreateGenreDto } from "./dto/createGenre.dto";
import { MovieService } from "src/movie/movie.service";
import { Collection } from "./genre.interface";

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name)
    private readonly GenreModel: GenreModel,

    private readonly movieService: MovieService,
  ) {}

  async bySlug(slug: string) {
    const genre = await this.GenreModel.findOne({ slug }).exec();
    if (!genre) throw new NotFoundException("Genre not found");

    return genre;
  }

  async getAll(searchTerm?: string) {
    const option = {};

    if (searchTerm) {
      option["$or"] = [
        { name: new RegExp(searchTerm, "i") },
        { slug: new RegExp(searchTerm, "i") },
        { description: new RegExp(searchTerm, "i") },
      ];
    }

    const genres = await this.GenreModel.find(option)
      .select("-updatedAt -__v")
      .sort({ createAt: "desc" })
      .exec();

    return genres;
  }

  async getCollections() {
    const genres = await this.getAll();
    const collections = await Promise.all(
      genres.map(async (genre) => {
        const moviesByGenre = await this.movieService.byGenres([genre._id]);
        if (!moviesByGenre.length) return;

        const collection: Collection = {
          _id: String(genre._id),
          image: moviesByGenre[0].bigPoster,
          slug: genre.slug,
          title: genre.name,
        };

        return collection;
      }),
    );

    const filteredCollection = collections.filter((collection) => collection);
    return filteredCollection;
  }

  /* Admin place */

  async byId(_id: string) {
    const genre = await this.GenreModel.findById(_id);
    if (!genre) throw new NotFoundException("Genre not found");

    return genre;
  }

  async create() {
    const defaultValue: CreateGenreDto = {
      name: "",
      slug: "",
      description: "",
      icon: "",
    };

    const genre = await this.GenreModel.create(defaultValue);
    return genre._id;
  }

  async update(_id: string, dto: CreateGenreDto) {
    const genre = await this.GenreModel.findByIdAndUpdate(_id, dto, {
      runValidators: true,
      new: true,
    }).exec();

    if (!genre) {
      throw new NotFoundException("Genre not found");
    }

    return genre;
  }

  async delete(_id: string) {
    const genre = await this.GenreModel.findByIdAndDelete(_id).exec();
    if (!genre) throw new NotFoundException("Genre not found");

    return null;
  }
}
