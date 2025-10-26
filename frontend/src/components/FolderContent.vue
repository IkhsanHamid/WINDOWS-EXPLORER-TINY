<template>
  <div class="folder-content">
    <!-- Tombol hanya ditampilkan saat home (tidak ada folder yang dipilih) -->
    <div v-if="!selectedFolderId" class="content-header">
      <div class="content-actions">
        <button
          class="action-btn"
          @click="showNewFolderDialog = true"
          title="New Folder"
        >
          📁 New
        </button>
      </div>
    </div>

    <div v-if="!selectedFolderId" class="empty-state">
      <div class="empty-icon">📂</div>
      <p>Select a folder to view its contents</p>
    </div>

    <div v-else>
      <!-- Tombol hanya ditampilkan saat ada folder yang dipilih -->
      <div class="content-header">
        <breadcrumb :items="breadcrumb" @navigate="$emit('navigate', $event)" />
        <div class="content-actions">
          <button
            class="action-btn"
            @click="showNewFolderDialog = true"
            title="New Folder"
          >
            📁 New
          </button>
          <button
            class="action-btn"
            @click="showNewFileDialog = true"
            title="New File"
          >
            📄 New
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else class="content-area">
        <div class="section">
          <h3>📁 Subfolders ({{ children.length }})</h3>
          <div v-if="children.length === 0" class="empty-list">
            No subfolders
          </div>
          <div v-else class="item-list">
            <div
              v-for="folder in children"
              :key="folder.id"
              class="item folder-item"
              @click="$emit('select', folder.id)"
              @contextmenu.prevent="showContextMenu($event, 'folder', folder)"
            >
              <span class="icon">📁</span>
              <span class="name">{{ folder.name }}</span>
              <span class="date">{{ formatDate(folder.updatedAt) }}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>📄 Files ({{ files.length }})</h3>
          <div v-if="files.length === 0" class="empty-list">No files</div>
          <div v-else class="item-list">
            <div
              v-for="file in files"
              :key="file.id"
              class="item file-item"
              @contextmenu.prevent="showContextMenu($event, 'file', file)"
            >
              <span class="icon">{{ getFileIcon(file.mimeType) }}</span>
              <span class="name">{{ file.name }}</span>
              <span class="size">{{ formatSize(Number(file.size)) }}</span>
              <span class="date">{{ formatDate(file.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Context Menu -->
    <context-menu
      :show="contextMenuShow"
      :x="contextMenuX"
      :y="contextMenuY"
      :item-type="contextMenuType"
      @rename="openRenameDialog"
      @delete="openDeleteConfirm"
      @new-folder="showNewFolderDialog = true"
      @new-file="showNewFileDialog = true"
      @close="contextMenuShow = false"
    />

    <!-- New Folder Dialog -->
    <modal-dialog
      :show="showNewFolderDialog"
      title="Create New Folder"
      confirm-text="Create"
      @close="showNewFolderDialog = false"
      @confirm="handleCreateFolder"
    >
      <input-field
        v-model="newFolderName"
        label="Folder Name"
        placeholder="Enter folder name"
        :error="formError"
        @enter="handleCreateFolder"
        @escape="showNewFolderDialog = false"
      />
    </modal-dialog>

    <!-- New File Dialog -->
    <modal-dialog
      :show="showNewFileDialog"
      title="Create New File"
      confirm-text="Create"
      @close="showNewFileDialog = false"
      @confirm="handleCreateFile"
    >
      <input-field
        v-model="newFileName"
        label="File Name"
        placeholder="Enter file name"
        :error="formError"
        @enter="handleCreateFile"
        @escape="showNewFileDialog = false"
      />
    </modal-dialog>

    <!-- Rename Dialog -->
    <modal-dialog
      :show="showRenameDialog"
      :title="`Rename ${renamingItem?.type === 'folder' ? 'Folder' : 'File'}`"
      confirm-text="Rename"
      @close="showRenameDialog = false"
      @confirm="handleRename"
    >
      <input-field
        v-model="renamingName"
        label="New Name"
        placeholder="Enter new name"
        :error="formError"
        @enter="handleRename"
        @escape="showRenameDialog = false"
      />
    </modal-dialog>

    <!-- Delete Confirmation Dialog -->
    <modal-dialog
      :show="showDeleteDialog"
      :title="`Delete ${deletingItem?.type === 'folder' ? 'Folder' : 'File'}?`"
      confirm-text="Delete"
      @close="showDeleteDialog = false"
      @confirm="handleDelete"
    >
      <p class="delete-warning">
        Are you sure you want to delete <strong>{{ deletingItem?.name }}</strong
        >? This action cannot be undone.
      </p>
    </modal-dialog>

    <!-- Success/Error Messages -->
    <div v-if="actionSuccess" class="toast toast-success">
      ✓ {{ actionSuccess }}
    </div>
    <div v-if="actionError" class="toast toast-error">✕ {{ actionError }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, watch } from "vue";
import Breadcrumb from "./Breadcrumb.vue";
import ContextMenu from "./ContextMenu.vue";
import ModalDialog from "./ModalDialog.vue";
import InputField from "./InputField.vue";
import { useFolderActions } from "../composables/useFolderActions";
import type { FolderDTO, FileDTO } from "../types";

// ✅ defineProps assigned to a variable
const props = defineProps<{
  selectedFolderId: string | null;
  children: FolderDTO[];
  files: FileDTO[];
  loading: boolean;
  error: string | null;
  breadcrumb: FolderDTO[];
}>();

const emit = defineEmits<{
  select: [folderId: string];
  navigate: [folderId: string];
  refresh: [];
}>();

const {
  createFolder,
  createFile,
  updateFolder,
  updateFile,
  deleteFolder,
  deleteFile,
  error: actionError,
  success: actionSuccess,
} = useFolderActions();

// Dialogs
const showNewFolderDialog = ref(false);
const showNewFileDialog = ref(false);
const showRenameDialog = ref(false);
const showDeleteDialog = ref(false);

// Form states
const newFolderName = ref("");
const newFileName = ref("");
const renamingName = ref("");
const formError = ref("");

// Context menu
const contextMenuShow = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const contextMenuType = ref<"folder" | "file">("folder");

// Items being edited/deleted
const renamingItem = ref<{
  id: string;
  name: string;
  type: "folder" | "file";
} | null>(null);
const deletingItem = ref<{
  id: string;
  name: string;
  type: "folder" | "file";
} | null>(null);

const formatSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.startsWith("video/")) return "🎬";
  if (mimeType.startsWith("audio/")) return "🎵";
  if (mimeType.includes("pdf")) return "📕";
  if (mimeType.includes("word") || mimeType.includes("document")) return "📘";
  if (
    mimeType.includes("sheet") ||
    mimeType.includes("excel") ||
    mimeType.includes("spreadsheet")
  )
    return "📗";
  return "📄";
};

// ✅ fixed to receive event param
const showContextMenu = (
  event: MouseEvent,
  type: "folder" | "file",
  item: FolderDTO | FileDTO
) => {
  contextMenuType.value = type;
  contextMenuShow.value = true;
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;

  renamingItem.value = { id: item.id, name: item.name, type };
  deletingItem.value = { id: item.id, name: item.name, type };
};

const openRenameDialog = () => {
  if (renamingItem.value) {
    renamingName.value = renamingItem.value.name;
  }
  showRenameDialog.value = true;
  formError.value = "";
};

const openDeleteConfirm = () => {
  showDeleteDialog.value = true;
  formError.value = "";
};

const handleCreateFolder = async () => {
  formError.value = "";
  if (!newFolderName.value.trim()) {
    formError.value = "Folder name cannot be empty";
    return;
  }

  try {
    await createFolder(
      newFolderName.value,
      props.selectedFolderId || undefined
    );
    showNewFolderDialog.value = false;
    newFolderName.value = "";
    emit("refresh");
  } catch {
    formError.value = actionError.value || "Failed to create folder";
  }
};

const handleCreateFile = async () => {
  formError.value = "";
  if (!newFileName.value.trim()) {
    formError.value = "File name cannot be empty";
    return;
  }
  if (!props.selectedFolderId) {
    formError.value = "Please select a folder first";
    return;
  }

  try {
    await createFile(newFileName.value, props.selectedFolderId);
    showNewFileDialog.value = false;
    newFileName.value = "";
    emit("refresh");
  } catch {
    formError.value = actionError.value || "Failed to create file";
  }
};

const handleRename = async () => {
  formError.value = "";
  if (!renamingName.value.trim()) {
    formError.value = "Name cannot be empty";
    return;
  }
  if (!renamingItem.value) return;

  try {
    if (renamingItem.value.type === "folder") {
      await updateFolder(renamingItem.value.id, renamingName.value);
    } else {
      await updateFile(renamingItem.value.id, renamingName.value);
    }
    showRenameDialog.value = false;
    renamingName.value = "";
    emit("refresh");
  } catch {
    formError.value = actionError.value || "Failed to rename";
  }
};

const handleDelete = async () => {
  if (!deletingItem.value) return;

  try {
    if (deletingItem.value.type === "folder") {
      await deleteFolder(deletingItem.value.id, deletingItem.value.name);
    } else {
      await deleteFile(deletingItem.value.id, deletingItem.value.name);
    }
    showDeleteDialog.value = false;
    emit("refresh");
  } catch {
    formError.value = actionError.value || "Failed to delete";
  }
};

onMounted(() => {
  document.addEventListener("click", () => (contextMenuShow.value = false));
});

// ✅ auto-hide toast
watch(actionSuccess, (newVal) => {
  if (newVal) setTimeout(() => (actionSuccess.value = null), 3000);
});
watch(actionError, (newVal) => {
  if (newVal) setTimeout(() => (actionError.value = null), 3000);
});
</script>

<style scoped>
.folder-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden;
  position: relative;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

.content-header {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.content-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #f0f0f0;
  border-color: #999;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.loading,
.error {
  padding: 16px;
  text-align: center;
  font-size: 14px;
}

.error {
  color: #d32f2f;
}

.section {
  margin-bottom: 24px;
}

.section h3 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.empty-list {
  padding: 12px;
  text-align: center;
  font-size: 12px;
  color: #999;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
  user-select: none;
}

.item:hover {
  background-color: #f0f0f0;
}

.folder-item {
  font-weight: 500;
}

.icon {
  margin-right: 8px;
  font-size: 16px;
}

.name {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.size,
.date {
  margin-left: 12px;
  color: #999;
  font-size: 12px;
  white-space: nowrap;
}

.delete-warning {
  margin: 0;
  font-size: 13px;
  color: #333;
  line-height: 1.5;
}

.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  animation: slideIn 0.3s ease-out;
}

.toast-success {
  background-color: #4caf50;
  color: white;
}

.toast-error {
  background-color: #f44336;
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
