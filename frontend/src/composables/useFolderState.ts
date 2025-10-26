import { ref } from "vue";
import { folderService } from "../services/folderService";
import type { FolderTreeNode, FolderDTO, FileDTO } from "../types";

export function useFolderState() {
  const tree = ref<FolderTreeNode[]>([]);
  const selectedFolderId = ref<string | null>(null);
  const children = ref<FolderDTO[]>([]);
  const files = ref<FileDTO[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const expandedFolders = ref(new Set<string>());
  const breadcrumb = ref<FolderDTO[]>([]);

  const loadTree = async () => {
    loading.value = true;
    error.value = null;
    try {
      tree.value = await folderService.getFullTree();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load folder tree";
    } finally {
      loading.value = false;
    }
  };

  const selectFolder = async (folderId: string) => {
    loading.value = true;
    error.value = null;
    try {
      selectedFolderId.value = folderId;
      const [childrenData, filesData, breadcrumbData] = await Promise.all([
        folderService.getDirectChildren(folderId),
        folderService.getFiles(folderId),
        folderService.getBreadcrumb(folderId),
      ]);
      children.value = childrenData;
      files.value = filesData;
      breadcrumb.value = breadcrumbData;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load folder content";
      selectedFolderId.value = null;
    } finally {
      loading.value = false;
    }
  };

  const toggleFolder = (folderId: string) => {
    if (expandedFolders.value.has(folderId)) {
      expandedFolders.value.delete(folderId);
    } else {
      expandedFolders.value.add(folderId);
    }
  };

  const isFolderExpanded = (folderId: string) =>
    expandedFolders.value.has(folderId);

  return {
    tree,
    selectedFolderId,
    children,
    files,
    loading,
    error,
    expandedFolders,
    breadcrumb,
    loadTree,
    selectFolder,
    toggleFolder,
    isFolderExpanded,
  };
}
