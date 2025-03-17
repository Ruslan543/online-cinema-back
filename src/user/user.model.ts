import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { hash, genSalt } from "bcryptjs";
import { HydratedDocument, Model, Types } from "mongoose";

export type UserDocument = HydratedDocument<User>;

export interface UserModel extends Model<UserDocument> {
  hashingPassword(password: string): Promise<string>;
}

@Schema({ timestamps: true }) // Добавляет createdAt и updatedAt
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ type: [Types.ObjectId], ref: "Movie", default: [] })
  favorites: Types.ObjectId[];

  @Prop()
  passwordChangedAt: Date;

  static async hashingPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.statics.hashingPassword = User.hashingPassword;
