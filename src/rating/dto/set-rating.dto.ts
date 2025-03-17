import { Transform } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";
import { Types } from "mongoose";
import { IsObjectId } from "src/decorators/isObjectId.decorator";

function transformToObjectId({ value }) {
  const valueString = String(value);
  if (!Types.ObjectId.isValid(valueString)) return value;

  return new Types.ObjectId(valueString);
}

export class SetRatingDto {
  @IsObjectId({ message: "Movie id is invalid" })
  @Transform(transformToObjectId)
  movie: Types.ObjectId;

  @IsNumber()
  value: number;
}

// @Min(1, { message: "Value must be at least 1" })
// @Max(5, { message: "Value must not be greater than 5" })
