import type { Elysia } from "elysia";
import { SearchService } from "./search.service";
import * as searchRoutes from "./search.routes";
import { Validator } from "../../validation/validator";
import { SearchSchema } from "../../validation/schemas";

export class SearchController {
  constructor(private searchService: SearchService) {}

  async search(query: string) {
    const validated = Validator.validate<{ q: string }>(
      { q: query },
      SearchSchema
    );
    return this.searchService.search(validated.q);
  }

  registerRoutes(app: Elysia): Elysia {
    return searchRoutes.registerSearchRoutes(app, this);
  }
}
