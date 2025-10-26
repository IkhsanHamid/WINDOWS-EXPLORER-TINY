import type { Elysia } from "elysia";
import { FileService } from "./file.service";
import * as fileRoutes from "./file.routes";
import type { CreateFileRequest } from "./file.types";
import { Validator } from "../../validation/validator";
import {
  CreateFileSchema,
  FileIdSchema,
  PaginationSchema,
} from "../../validation/schemas";

interface PaginationQuery {
  skip?: number;
  take?: number;
}

export class FileController {
  constructor(private fileService: FileService) {}

  async getFilesByFolder(folderId: string, query: PaginationQuery) {
    const validatedId = Validator.validate<{ id: string }>(
      { id: folderId },
      FileIdSchema
    );
    const validatedPagination = Validator.validate<PaginationQuery>(
      { skip: query.skip, take: query.take },
      PaginationSchema
    );
    return this.fileService.getFilesByFolder(
      validatedId.id,
      validatedPagination.skip,
      validatedPagination.take
    );
  }

  async createFile(body: unknown) {
    const validated = Validator.validate<CreateFileRequest>(
      body,
      CreateFileSchema
    );
    return this.fileService.createFile(validated);
  }

  async deleteFile(id: string) {
    const validated = Validator.validate<{ id: string }>({ id }, FileIdSchema);
    return this.fileService.deleteFile(validated.id);
  }

  registerRoutes(app: Elysia): Elysia {
    return fileRoutes.registerFileRoutes(app, this);
  }
}
