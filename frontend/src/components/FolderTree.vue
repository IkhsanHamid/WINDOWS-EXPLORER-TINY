<template>
  <div class="folder-tree">
    <div class="tree-header">
      <h2>📁 Folders</h2>
    </div>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="tree.length === 0" class="empty-state">
      No folders yet. Create one to get started!
    </div>
    <div v-else class="tree-content">
      <tree-node
        v-for="node in tree"
        :key="node.id"
        :node="node"
        @select="handleSelect"
        @toggle="handleToggle"
        @delete="handleDelete"
        @rename="handleRename"
        :is-expanded="isFolderExpanded"
      />
    </div>
  </div>

  <!-- Added delete confirmation dialog -->
  <modal-dialog
    :show="showDeleteDialog"
    title="Delete Folder?"
    confirm-text="Delete"
    @close="showDeleteDialog = false"
    @confirm="confirmDelete"
  >
    <p class="delete-warning">
      Are you sure you want to delete <strong>{{ deletingFolderName }}</strong
      >? This action cannot be undone.
    </p>
  </modal-dialog>

  <!-- Added rename dialog -->
  <modal-dialog
    :show="showRenameDialog"
    title="Rename Folder"
    confirm-text="Rename"
    @close="showRenameDialog = false"
    @confirm="confirmRename"
  >
    <input-field
      v-model="renamingName"
      label="New Name"
      placeholder="Enter new name"
      :error="formError"
      @enter="confirmRename"
      @escape="showRenameDialog = false"
    />
  </modal-dialog>

  <!-- Added success/error toasts -->
  <div v-if="actionSuccess" class="toast toast-success">
    ✓ {{ actionSuccess }}
  </div>
  <div v-if="actionError" class="toast toast-error">✕ {{ actionError }}</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import TreeNode from "./TreeNode.vue";
import ModalDialog from "./ModalDialog.vue";
import InputField from "./InputField.vue";
import { useFolderActions } from "../composables/useFolderActions";
import type { FolderTreeNode } from "../types";

const props = defineProps<{
  tree: FolderTreeNode[];
  loading: boolean;
  error: string | null;
  isFolderExpanded: (id: string) => boolean;
}>();

const emit = defineEmits<{
  select: [folderId: string];
  toggle: [folderId: string];
  "add-root": [];
  refresh: [];
}>();

const {
  deleteFolder,
  updateFolder,
  error: actionError,
  success: actionSuccess,
} = useFolderActions();

const handleToggle = (folderId: string) => {
  emit("toggle", folderId);
};

const showDeleteDialog = ref(false);
const deletingFolderId = ref<string | null>(null);
const deletingFolderName = ref("");

const handleDelete = (folderId: string) => {
  const folder = findFolderById(folderId);
  if (folder) {
    deletingFolderId.value = folderId;
    deletingFolderName.value = folder.name;
    showDeleteDialog.value = true;
  }
};

const confirmDelete = async () => {
  if (!deletingFolderId.value) return;
  try {
    await deleteFolder(deletingFolderId.value, deletingFolderName.value);
    showDeleteDialog.value = false;
    emit("refresh");
  } catch {
    // Error is handled by useFolderActions
  }
};

const showRenameDialog = ref(false);
const renamingFolderId = ref<string | null>(null);
const renamingName = ref("");
const formError = ref("");

const handleRename = (folderId: string) => {
  const folder = findFolderById(folderId);
  if (folder) {
    renamingFolderId.value = folderId;
    renamingName.value = folder.name;
    showRenameDialog.value = true;
    formError.value = "";
  }
};

const confirmRename = async () => {
  formError.value = "";
  if (!renamingName.value.trim()) {
    formError.value = "Name cannot be empty";
    return;
  }
  if (!renamingFolderId.value) return;

  try {
    await updateFolder(renamingFolderId.value, renamingName.value);
    showRenameDialog.value = false;
    emit("refresh");
  } catch {
    formError.value = actionError.value || "Failed to rename";
  }
};

// Helper to find folder by ID in tree
const findFolderById = (id: string, tree = props.tree): any => {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findFolderById(id, node.children);
      if (found) return found;
    }
  }
  return null;
};

watch(actionSuccess, (newVal) => {
  if (newVal) setTimeout(() => (actionSuccess.value = null), 3000);
});
watch(actionError, (newVal) => {
  if (newVal) setTimeout(() => (actionError.value = null), 3000);
});

// Moved emit call to handleSelect function
const handleSelect = (folderId: string) => {
  emit("select", folderId);
};
</script>

<style scoped>
.folder-tree {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  overflow: hidden;
}

.tree-header {
  padding: 12px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tree-header h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.add-root-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.add-root-btn:hover {
  background-color: #e0e0e0;
}

.tree-content {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.loading,
.error,
.empty-state {
  padding: 12px;
  text-align: center;
  font-size: 12px;
  color: #999;
}

.error {
  color: #d32f2f;
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
