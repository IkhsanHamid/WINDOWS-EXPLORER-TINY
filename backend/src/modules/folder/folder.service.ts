import { FolderRepository } from "./folder.repository";
import type {
  FolderTreeNode,
  FolderDTO,
  CreateFolderRequest,
} from "./folder.types";
import { ValidationError } from "../../utils/errors";

export class FolderService {
  constructor(private repository: FolderRepository) {}

  async getFullFolderTree(): Promise<FolderTreeNode[]> {
    const roots = await this.repository.getRootFolders();
    return Promise.all(roots.map((folder) => this.buildTreeNode(folder.id)));
  }

  private async buildTreeNode(folderId: string): Promise<FolderTreeNode> {
    const folder = await this.repository.getFolderById(folderId);
    if (!folder) throw new Error(`Folder ${folderId} not found`);

    const children = await this.repository.getDirectChildren(folderId);

    return {
      id: folder.id,
      name: folder.name,
      hasChildren: children.length > 0,
      children:
        children.length > 0
          ? await Promise.all(
              children.map((child) => this.buildTreeNode(child.id))
            )
          : undefined,
    };
  }

  async getDirectChildren(folderId: string): Promise<FolderDTO[]> {
    return this.repository.getDirectChildren(folderId);
  }

  async createFolder(request: CreateFolderRequest): Promise<FolderDTO> {
    if (!request.name || request.name.trim().length === 0) {
      throw new ValidationError("Folder name is required");
    }

    return this.repository.createFolder(request.name.trim(), request.parentId);
  }

  async deleteFolder(id: string): Promise<void> {
    return this.repository.deleteFolder(id);
  }

  async searchFolders(query: string): Promise<FolderDTO[]> {
    if (query.length < 2) {
      throw new ValidationError("Search query must be at least 2 characters");
    }
    return this.repository.searchFolders(query);
  }

  async getFolderBreadcrumb(folderId: string): Promise<FolderDTO[]> {
    const ancestors = await this.repository.getFolderAncestors(folderId);
    const folder = await this.repository.getFolderById(folderId);
    if (folder) ancestors.push(folder);
    return ancestors;
  }
}
