<template>
  <div class="search-container" ref="searchContainer">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="🔍 Search folders and files..."
      class="search-input"
      @focus="showResults = true"
      @keyup.enter="search"
    />

    <!-- Loading state -->
    <div v-if="isSearching && showResults" class="search-results">
      <div class="loading-state">Searching...</div>
    </div>

    <!-- Show results -->
    <div
      v-else-if="showResults && hasResults && (folders.length || files.length)"
      class="search-results"
    >
      <div v-if="folders.length" class="results-section">
        <h4>📁 Folders ({{ folders.length }})</h4>
        <div
          v-for="folder in folders"
          :key="folder.id"
          class="result-item"
          @click="selectFolder(folder.id)"
        >
          <span class="icon">📁</span>
          <span class="text">{{ folder.name }}</span>
        </div>
      </div>

      <div v-if="files.length" class="results-section">
        <h4>📄 Files ({{ files.length }})</h4>
        <div v-for="file in files" :key="file.id" class="result-item">
          <span class="icon">📄</span>
          <span class="text">{{ file.name }}</span>
        </div>
      </div>
    </div>

    <!-- No results -->
    <div
      v-else-if="
        showResults && searchQuery && searchQuery.length >= 2 && !isSearching
      "
      class="search-results"
    >
      <div class="no-results">No results found for "{{ searchQuery }}"</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useSearch } from "../composables/useSearch";

const emit = defineEmits<{
  "select-folder": [folderId: string];
}>();

const { searchQuery, searchResults, isSearching, hasResults, search } =
  useSearch();

const folders = computed(() => searchResults.value.folders ?? []);
const files = computed(() => searchResults.value.files ?? []);

const showResults = ref(false);
const searchContainer = ref<HTMLElement | null>(null);

const selectFolder = (folderId: string) => {
  emit("select-folder", folderId);
  showResults.value = false; // sembunyikan hasil
};

// Auto search ketika user mengetik minimal 2 huruf
watch(searchQuery, (value) => {
  if (value.length >= 2) {
    showResults.value = true;
    search();
  } else {
    showResults.value = false;
  }
});

// Tutup dropdown ketika klik di luar area
const handleClickOutside = (e: MouseEvent) => {
  if (
    searchContainer.value &&
    !searchContainer.value.contains(e.target as Node)
  ) {
    showResults.value = false;
  }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside)
);
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: #fff;
  color: #000;
}

.search-input:focus {
  border-color: #0078d7;
  box-shadow: 0 0 0 2px rgba(0, 120, 215, 0.2);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 320px;
  overflow-y: auto;
  z-index: 20;
}

.loading-state,
.no-results {
  padding: 12px;
  text-align: center;
  font-size: 13px;
  color: #666;
}

.results-section {
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}

.results-section:last-child {
  border-bottom: none;
}

.results-section h4 {
  margin: 0;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
}

.result-item {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #000;
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: #f5f5f5;
}

.icon {
  font-size: 14px;
}

.text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
