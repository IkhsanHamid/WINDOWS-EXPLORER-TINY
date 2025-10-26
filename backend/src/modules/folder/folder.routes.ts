import { Elysia, t } from "elysia";
import type { FolderController } from "./folder.controller";
import type { CreateFolderRequest } from "./folder.types";
import { CreateFolderSchema } from "../../validation/schemas";

export const registerFolderRoutes = (
  app: Elysia,
  controller: FolderController
): Elysia => {
  return app.group("/api/v1/folders", (app) =>
    app
      .get("/tree", async () => controller.getFullFolderTree(), {
        description: "Get complete folder tree structure",
        response: t.Array(t.Any()),
      })
      .get(
        "/:id/children",
        async ({ params: { id } }) => controller.getDirectChildren(id),
        {
          params: t.Object({ id: t.String() }),
          description: "Get direct children of a folder",
        }
      )
      .get(
        "/:id/breadcrumb",
        async ({ params: { id } }) => controller.getFolderBreadcrumb(id),
        {
          params: t.Object({ id: t.String() }),
          description: "Get folder breadcrumb path",
        }
      )
      .post(
        "/",
        async (context) =>
          controller.createFolder(context.body as CreateFolderRequest),
        {
          body: CreateFolderSchema,
          description: "Create a new folder",
        }
      )

      .delete(
        "/:id",
        async ({ params: { id } }) => controller.deleteFolder(id),
        {
          params: t.Object({ id: t.String() }),
          description: "Delete a folder by ID",
        }
      )
  );
};
