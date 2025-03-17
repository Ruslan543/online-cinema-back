import { Types } from "mongoose";
import { IsObjectIdArray } from "../../decorators/isObjectIdArray.decorator";
import { IsArray, IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";
import { transformToObjectIds } from "./update-movie.dto";
import { IsObjectId } from "src/decorators/isObjectId.decorator";

export class GenreIdsDto {
  @IsArray()
  @IsNotEmpty()
  @IsObjectId({ each: true, message: "Invalid genreIds array" })
  @Transform(transformToObjectIds)
  genreIds: Types.ObjectId[];
}
