import { FolderService } from "../folder/folder.service";
import { FileService } from "../file/file.service";
import type { SearchResult } from "./search.types";
import { ValidationError } from "../../utils/errors";

export class SearchService {
  constructor(
    private folderService: FolderService,
    private fileService: FileService
  ) {}

  async search(query: string): Promise<SearchResult> {
    if (query.length < 2) {
      throw new ValidationError("Search query must be at least 2 characters");
    }

    const trimmedQuery = query.trim();

    try {
      const [folders, files] = await Promise.all([
        this.folderService.searchFolders(trimmedQuery),
        this.fileService.searchFiles(trimmedQuery),
      ]);

      return {
        folders: folders.map((f) => ({
          id: f.id,
          name: f.name,
          parentId: f.parentId,
        })),
        files: files.map((f) => ({
          id: f.id,
          name: f.name,
          folderId: f.folderId,
        })),
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error("Search failed");
    }
  }
}
