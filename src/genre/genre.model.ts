import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";

export type GenreDocument = HydratedDocument<Genre>;
export interface GenreModel extends Model<GenreDocument> {}

@Schema({ timestamps: true })
export class Genre {
  @Prop()
  name: string;

  @Prop({ unique: true })
  slug: string;

  @Prop()
  description: string;

  @Prop()
  icon: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
