import { Elysia } from "elysia";
import { AppError } from "../utils/errors";

export const createErrorMiddleware = (app: Elysia): Elysia => {
  app.onError(({ error, set }) => {
    if (error instanceof AppError) {
      set.status = error.statusCode;
      return {
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }

    if (error instanceof SyntaxError) {
      set.status = 400;
      return {
        error: {
          code: "INVALID_JSON",
          message: "Invalid request body",
        },
      };
    }

    console.error("Unexpected error:", error);
    set.status = 500;
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
      },
    };
  });

  return app;
};
