import type { Elysia } from "elysia";
import { FolderService } from "./folder.service";
import * as folderRoutes from "./folder.routes";
import type { CreateFolderRequest } from "./folder.types";
import { CreateFolderSchema } from "../../validation/schemas";
import { Validator } from "../../validation/validator";

export class FolderController {
  constructor(private folderService: FolderService) {}

  async getFullFolderTree() {
    return this.folderService.getFullFolderTree();
  }

  async getDirectChildren(folderId: string) {
    return this.folderService.getDirectChildren(folderId);
  }

  async getFolderBreadcrumb(folderId: string) {
    return this.folderService.getFolderBreadcrumb(folderId);
  }

  async createFolder(body: CreateFolderRequest) {
    const validated = Validator.validate<CreateFolderRequest>(
      body,
      CreateFolderSchema
    );
    return this.folderService.createFolder(validated);
  }

  async deleteFolder(id: string) {
    return this.folderService.deleteFolder(id);
  }

  registerRoutes(app: Elysia): Elysia {
    return folderRoutes.registerFolderRoutes(app, this);
  }
}
