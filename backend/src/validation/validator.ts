import Joi from "joi";
import { ValidationError } from "../utils/errors";

export class Validator {
  static validate<T>(data: unknown, schema: Joi.Schema): T {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join("; ");
      throw new ValidationError(messages);
    }

    return value as T;
  }

  static async validateAsync<T>(data: unknown, schema: Joi.Schema): Promise<T> {
    try {
      return (await schema.validateAsync(data, {
        abortEarly: false,
        stripUnknown: true,
      })) as T;
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        const messages = error.details
          .map((detail) => detail.message)
          .join("; ");
        throw new ValidationError(messages);
      }
      throw error;
    }
  }
}
