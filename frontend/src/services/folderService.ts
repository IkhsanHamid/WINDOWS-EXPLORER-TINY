import apiClient from "./api";
import type {
  FolderTreeNode,
  FolderDTO,
  FileDTO,
  SearchResult,
} from "../types";

export const folderService = {
  async getFullTree(): Promise<FolderTreeNode[]> {
    return apiClient.get("/folders/tree");
  },

  async getDirectChildren(folderId: string): Promise<FolderDTO[]> {
    return apiClient.get(`/folders/${folderId}/children`);
  },

  async getBreadcrumb(folderId: string): Promise<FolderDTO[]> {
    return apiClient.get(`/folders/${folderId}/breadcrumb`);
  },

  async getFiles(folderId: string, skip = 0, take = 100): Promise<FileDTO[]> {
    return apiClient.get(`/files/folder/${folderId}`, {
      params: { skip, take },
    });
  },

  async search(query: string): Promise<SearchResult> {
    return apiClient.get("/search", { params: { q: query } });
  },

  async createFolder(name: string, parentId?: string): Promise<FolderDTO> {
    return apiClient.post("/folders", { name, parentId });
  },

  async updateFolder(id: string, name: string): Promise<FolderDTO> {
    return apiClient.patch(`/folders/${id}`, { name });
  },

  async deleteFolder(id: string): Promise<void> {
    await apiClient.delete(`/folders/${id}`);
  },

  async createFile(
    name: string,
    folderId: string,
    size: number,
    mimeType: string
  ): Promise<FileDTO> {
    return apiClient.post("/files", {
      name,
      folderId,
      size,
      mimeType,
    });
  },

  async updateFile(id: string, name: string): Promise<FileDTO> {
    return apiClient.patch(`/files/${id}`, { name });
  },

  async deleteFile(id: string): Promise<void> {
    await apiClient.delete(`/files/${id}`);
  },
};
