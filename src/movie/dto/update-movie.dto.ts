import { IsArray, IsNumber, IsObject, IsString } from "class-validator";
import { Types } from "mongoose";
import { IsObjectId } from "src/decorators/isObjectId.decorator";

export function transformToObjectIds({ value }) {
  if (!Array.isArray(value)) return value;

  const result = value.map((value: string | Types.ObjectId | any) => {
    const valueString = String(value);
    if (!Types.ObjectId.isValid(valueString)) return value;

    return new Types.ObjectId(valueString);
  });

  return result;
}

export class Parameters {
  @IsNumber()
  year: number;

  @IsNumber()
  duration: number;

  @IsString()
  country: string;
}

export class UpdateMovieDto {
  @IsString()
  poster: string;

  @IsString()
  bigPoster: string;

  @IsString()
  title: string;

  @IsString()
  slug: string;

  countOpened?: number;

  rating?: number;

  @IsObject()
  parameters?: Parameters;

  @IsString()
  videoUrl: string;

  @IsArray()
  @IsObjectId({ each: true, message: "Invalid genreIds array" })
  genres: Types.ObjectId[];

  @IsArray()
  @IsObjectId({ each: true, message: "Invalid actorIds array" })
  actors: Types.ObjectId[];

  isSendTelegram?: boolean;
}

// @Transform(transformToObjectIds)
