import { Elysia, t } from "elysia";
import type { FileController } from "./file.controller";
import type { CreateFileRequest } from "./file.types";
import { CreateFileSchema } from "../../validation/schemas";

export const registerFileRoutes = (
  app: Elysia,
  controller: FileController
): Elysia => {
  return app.group("/api/v1/files", (app) =>
    app
      .get(
        "/folder/:folderId",
        async ({ params: { folderId }, query }) =>
          controller.getFilesByFolder(folderId, {
            skip: Number(query.skip),
            take: Number(query.take),
          }),
        {
          params: t.Object({ folderId: t.String() }),
          query: t.Object({
            skip: t.Optional(t.Number({ default: 0 })),
            take: t.Optional(t.Number({ default: 100 })),
          }),
          description: "Get files in a folder with pagination",
        }
      )
      .post(
        "/",
        async (context) =>
          controller.createFile(context.body as CreateFileRequest),
        {
          body: CreateFileSchema,
          description: "Create a new file",
        }
      )
      .delete("/:id", async ({ params: { id } }) => controller.deleteFile(id), {
        params: t.Object({ id: t.String() }),
        description: "Delete a file by ID",
      })
  );
};
