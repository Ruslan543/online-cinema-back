import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Actor, ActorModel } from "./actor.model";
import { ActorDto } from "./actor.dto";

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(Actor.name)
    private readonly ActorModel: ActorModel,
  ) {}

  async bySlug(slug: string) {
    const actor = await this.ActorModel.findOne({ slug }).exec();
    if (!actor) throw new NotFoundException("Actor not found");

    return actor;
  }

  async getAll(searchTerm?: string) {
    const options = {};

    if (searchTerm) {
      options["$or"] = [
        { name: new RegExp(searchTerm, "i") },
        { slug: new RegExp(searchTerm, "i") },
      ];
    }

    const actors = await this.ActorModel.aggregate()
      .match(options)
      .lookup({
        from: "movies",
        let: { actorId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$$actorId", "$actors"],
              },
            },
          },
          { $project: { _id: 1 } },
        ],
        as: "movies",
      })
      .addFields({
        countMovies: { $size: "$movies" },
      })
      .project({ __v: 0, updatedAt: 0, movies: 0 })
      .sort({ createdAt: -1 })
      .exec();

    return actors;
  }

  /* Admin place */

  async byId(_id: string) {
    const actor = await this.ActorModel.findById(_id);
    if (!actor) throw new NotFoundException("Actor not found");

    return actor;
  }

  async create() {
    const defaultValue: ActorDto = {
      name: "",
      slug: "",
      photo: "",
    };

    const actor = await this.ActorModel.create(defaultValue);
    return actor._id;
  }

  async update(_id: string, dto: ActorDto) {
    const actor = await this.ActorModel.findByIdAndUpdate(_id, dto, {
      runValidators: true,
      new: true,
    }).exec();

    if (!actor) {
      throw new NotFoundException("Actor not found");
    }

    return actor;
  }

  async delete(_id: string) {
    const actor = await this.ActorModel.findByIdAndDelete(_id).exec();
    if (!actor) throw new NotFoundException("Actor not found");

    return null;
  }
}
