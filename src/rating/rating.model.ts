import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";

export type RatingDocument = HydratedDocument<Rating>;
export interface RatingModel extends Model<RatingDocument> {}

@Schema({ timestamps: true })
export class Rating {
  @Prop({ type: Types.ObjectId, ref: "User" })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Movie" })
  movie: Types.ObjectId;

  @Prop()
  value: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);

// @Prop({
//   type: Types.ObjectId,
//   ref: "Movie",
//   set: (value: string | Types.ObjectId) => new Types.ObjectId(value),
// })
