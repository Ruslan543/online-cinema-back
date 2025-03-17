import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";

export type ActorDocument = HydratedDocument<Actor>;
export interface ActorModel extends Model<ActorDocument> {}

@Schema({ timestamps: true })
export class Actor {
  @Prop()
  name: string;

  @Prop({ unique: true })
  slug: string;

  @Prop()
  photo: string;
}

export const ActorSchema = SchemaFactory.createForClass(Actor);
