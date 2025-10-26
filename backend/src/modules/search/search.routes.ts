import { Elysia, t } from "elysia";
import type { SearchController } from "./search.controller";

export const registerSearchRoutes = (
  app: Elysia,
  controller: SearchController
): Elysia => {
  return app.group("/api/v1/search", (app) =>
    app.get("/", async ({ query }) => controller.search(query.q), {
      query: t.Object({
        q: t.String({ minLength: 2 }),
      }),
      description: "Search folders and files",
    })
  );
};
