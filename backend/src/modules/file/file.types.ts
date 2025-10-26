export interface FileDTO {
  id: string;
  name: string;
  folderId: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFileRequest {
  name: string;
  folderId: string;
  size: number;
  mimeType: string;
}
