import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Types } from "mongoose";

@ValidatorConstraint({ async: false })
export class IsObjectIdConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return Types.ObjectId.isValid(String(value));
  }

  defaultMessage() {
    return "Invalid ObjectId format";
  }
}

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsObjectIdConstraint,
    });
  };
}
