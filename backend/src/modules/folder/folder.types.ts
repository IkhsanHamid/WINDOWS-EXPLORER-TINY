export interface FolderDTO {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FolderWithChildren extends FolderDTO {
  children: FolderDTO[];
}

export interface FolderTreeNode {
  id: string;
  name: string;
  hasChildren: boolean;
  children?: FolderTreeNode[];
}

export interface PaginationParams {
  skip?: number;
  take?: number;
}

export interface CreateFolderRequest {
  name: string;
  parentId?: string;
}
