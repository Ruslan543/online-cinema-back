import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";

export type MovieDocument = HydratedDocument<Movie>;
export interface MovieModel extends Model<MovieDocument> {}

function setObjectId(value: string[]): Types.ObjectId[] {
  return value.map((el) => new Types.ObjectId(el));
}

@Schema()
export class Parameters {
  @Prop()
  year: number;

  @Prop()
  duration: number;

  @Prop()
  country: string;
}
export const ParametersSchema = SchemaFactory.createForClass(Parameters);

@Schema({ timestamps: true })
export class Movie {
  @Prop()
  poster: string;

  @Prop()
  bigPoster: string;

  @Prop()
  title: string;

  @Prop({ unique: true })
  slug: string;

  @Prop({ default: 0 })
  countOpened?: number;

  @Prop({ default: 4.0 })
  rating?: number;

  @Prop({ type: ParametersSchema })
  parameters?: Parameters;

  @Prop()
  videoUrl: string;

  @Prop({ type: [Types.ObjectId], ref: "Genre", set: setObjectId })
  genres: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: "Actor", set: setObjectId })
  actors: Types.ObjectId[];

  @Prop({ default: false })
  isSendTelegram?: boolean;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
