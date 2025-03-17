import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";

export class SlugValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== "body") return value;

    if (!value && typeof value !== "boolean") {
      throw new BadRequestException("Slug must not be empty");
    }

    if (typeof value !== "string") {
      throw new BadRequestException("Slug must be a string");
    }

    return value;
  }
}
