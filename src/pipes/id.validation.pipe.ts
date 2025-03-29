import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { Types } from "mongoose";

export class IdValidationPipe implements PipeTransform {
  constructor(private readonly isTransform: boolean = false) {}

  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== "param") return value;

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException("Invalid format id");
    }

    return this.isTransform ? new Types.ObjectId(value) : value;
  }

  static toObjectId() {
    return new IdValidationPipe(true);
  }
}
