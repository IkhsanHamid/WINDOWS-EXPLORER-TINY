import { FileRepository } from "./file.repository";
import type { FileDTO, CreateFileRequest } from "./file.types";
import { ValidationError } from "../../utils/errors";

export class FileService {
  constructor(private repository: FileRepository) {}

  async getFilesByFolder(
    folderId: string,
    skip = 0,
    take = 100
  ): Promise<FileDTO[]> {
    if (skip < 0 || take < 1) {
      throw new ValidationError("Invalid pagination parameters");
    }
    return this.repository.getFilesByFolder(folderId, skip, take);
  }

  async createFile(request: CreateFileRequest): Promise<FileDTO> {
    if (!request.name || request.name.trim().length === 0) {
      throw new ValidationError("File name is required");
    }
    if (request.size < 0) {
      throw new ValidationError("File size must be non-negative");
    }
    return this.repository.createFile(
      request.name,
      request.folderId,
      request.size,
      request.mimeType
    );
  }

  async deleteFile(id: string): Promise<void> {
    return this.repository.deleteFile(id);
  }

  async searchFiles(query: string): Promise<FileDTO[]> {
    if (query.length < 2) {
      throw new ValidationError("Search query must be at least 2 characters");
    }
    return this.repository.searchFiles(query);
  }
}
