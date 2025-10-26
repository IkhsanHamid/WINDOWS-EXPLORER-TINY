<template>
  <div class="app">
    <div class="header">
      <h1>📂 File Explorer</h1>
      <search-bar
        :search-query="searchQuery"
        :search-results="searchResults"
        :is-searching="isSearching"
        :has-results="hasResults"
        @search="handleSearch"
        @select-folder="handleSelectSearchFolder"
      />
    </div>

    <div class="container">
      <div class="left-panel">
        <folder-tree
          :tree="tree"
          :loading="loading"
          :error="error"
          :is-folder-expanded="isFolderExpanded"
          @select="handleSelectFolder"
          @toggle="handleToggleFolder"
          @add-root="handleAddRootFolder"
          @refresh="loadTree"
        />
      </div>

      <div class="right-panel">
        <folder-content
          :selected-folder-id="selectedFolderId"
          :children="children"
          :files="files"
          :loading="loading"
          :error="error"
          :breadcrumb="breadcrumb"
          @select="handleSelectFolder"
          @navigate="handleNavigate"
          @refresh="loadTree"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import FolderTree from "./components/FolderTree.vue";
import FolderContent from "./components/FolderContent.vue";
import SearchBar from "./components/SearchBar.vue";
import { useFolderState } from "./composables/useFolderState";
import { useSearch } from "./composables/useSearch";
import { useFolderActions } from "./composables/useFolderActions";

const {
  tree,
  selectedFolderId,
  children,
  files,
  loading,
  error,
  breadcrumb,
  loadTree,
  selectFolder,
  toggleFolder,
  isFolderExpanded,
} = useFolderState();

const {
  searchQuery,
  searchResults,
  isSearching,
  hasResults,
  search,
  clearSearch,
} = useSearch();

const { createFolder } = useFolderActions();

onMounted(() => {
  loadTree();
});

const handleSelectFolder = (folderId: string) => {
  selectFolder(folderId);
  clearSearch();
};

const handleToggleFolder = (folderId: string) => {
  toggleFolder(folderId);
};

const handleSearch = async () => {
  await search();
};

const handleSelectSearchFolder = (folderId: string) => {
  handleSelectFolder(folderId);
  clearSearch();
};

const handleNavigate = (folderId: string) => {
  if (folderId) {
    handleSelectFolder(folderId);
  } else {
    selectedFolderId.value = null;
  }
};

const handleAddRootFolder = async () => {
  const folderName = prompt("Enter root folder name:");
  if (folderName && folderName.trim()) {
    try {
      await createFolder(folderName.trim());
      await loadTree();
    } catch (err) {
      console.error("Failed to create root folder:", err);
    }
  }
};
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.header {
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 700;
}

.container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-panel {
  width: 300px;
  overflow: hidden;
  background-color: #fafafa;
  border-right: 1px solid #ddd;
}

.right-panel {
  flex: 1;
  overflow: hidden;
  background-color: #fff;
}

@media (max-width: 768px) {
  .left-panel {
    width: 200px;
  }

  .header {
    padding: 12px;
  }

  .header h1 {
    font-size: 18px;
    margin-bottom: 8px;
  }
}
</style>
