import { ref } from "vue";
import { folderService } from "../services/folderService";

export function useFolderActions() {
  const isCreating = ref(false);
  const isDeleting = ref(false);
  const isUpdating = ref(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);

  const createFolder = async (name: string, parentId?: string) => {
    isCreating.value = true;
    error.value = null;
    success.value = null;
    try {
      const folder = await folderService.createFolder(name, parentId);
      success.value = `Folder "${folder.name}" created successfully`;
      return folder;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to create folder";
      throw err;
    } finally {
      isCreating.value = false;
    }
  };

  const updateFolder = async (id: string, name: string) => {
    isUpdating.value = true;
    error.value = null;
    success.value = null;
    try {
      const folder = await folderService.updateFolder(id, name);
      success.value = `Folder renamed to "${folder.name}"`;
      return folder;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to update folder";
      throw err;
    } finally {
      isUpdating.value = false;
    }
  };

  const deleteFolder = async (id: string, name: string) => {
    isDeleting.value = true;
    error.value = null;
    success.value = null;
    try {
      await folderService.deleteFolder(id);
      success.value = `Folder "${name}" deleted successfully`;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to delete folder";
      throw err;
    } finally {
      isDeleting.value = false;
    }
  };

  const createFile = async (
    name: string,
    folderId: string,
    size: number = 0,
    mimeType: string = "application/octet-stream"
  ) => {
    isCreating.value = true;
    error.value = null;
    success.value = null;
    try {
      const file = await folderService.createFile(
        name,
        folderId,
        size,
        mimeType
      );
      success.value = `File "${file.name}" created successfully`;
      return file;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to create file";
      throw err;
    } finally {
      isCreating.value = false;
    }
  };

  const updateFile = async (id: string, name: string) => {
    isUpdating.value = true;
    error.value = null;
    success.value = null;
    try {
      const file = await folderService.updateFile(id, name);
      success.value = `File renamed to "${file.name}"`;
      return file;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to update file";
      throw err;
    } finally {
      isUpdating.value = false;
    }
  };

  const deleteFile = async (id: string, name: string) => {
    isDeleting.value = true;
    error.value = null;
    success.value = null;
    try {
      await folderService.deleteFile(id);
      success.value = `File "${name}" deleted successfully`;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to delete file";
      throw err;
    } finally {
      isDeleting.value = false;
    }
  };

  const clearMessages = () => {
    error.value = null;
    success.value = null;
  };

  return {
    isCreating,
    isDeleting,
    isUpdating,
    error,
    success,
    createFolder,
    updateFolder,
    deleteFolder,
    createFile,
    updateFile,
    deleteFile,
    clearMessages,
  };
}
