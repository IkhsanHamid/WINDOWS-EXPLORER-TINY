export interface SearchResult {
  folders: Array<{ id: string; name: string; parentId: string | null }>;
  files: Array<{ id: string; name: string; folderId: string }>;
}
