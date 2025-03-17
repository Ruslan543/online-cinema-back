import { Types } from "mongoose";
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ async: false })
export class IsObjectIdArrayConstraint implements ValidatorConstraintInterface {
  validate(values: any) {
    return (
      Array.isArray(values) &&
      values.every((value) => Types.ObjectId.isValid(String(value)))
    );
  }

  defaultMessage() {
    return "Invalid ObjectIds format";
  }
}

export function IsObjectIdArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsObjectIdArrayConstraint,
    });
  };
}
