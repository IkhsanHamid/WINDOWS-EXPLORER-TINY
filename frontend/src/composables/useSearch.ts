import { ref, computed } from "vue";
import { folderService } from "../services/folderService";
import type { SearchResult } from "../types";

export function useSearch() {
  const searchQuery = ref("");
  const searchResults = ref<SearchResult>({ folders: [], files: [] });
  const isSearching = ref(false);
  const error = ref<string | null>(null);

  const hasResults = computed(
    () =>
      searchResults.value.folders.length > 0 ||
      searchResults.value.files.length > 0
  );

  const search = async () => {
    if (searchQuery.value.length < 2) {
      searchResults.value = { folders: [], files: [] };
      return;
    }

    isSearching.value = true;
    error.value = null;
    try {
      searchResults.value = await folderService.search(searchQuery.value);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Search failed";
      searchResults.value = { folders: [], files: [] };
    } finally {
      isSearching.value = false;
    }
  };

  const clearSearch = () => {
    searchQuery.value = "";
    searchResults.value = { folders: [], files: [] };
  };

  return {
    searchQuery,
    searchResults,
    isSearching,
    error,
    hasResults,
    search,
    clearSearch,
  };
}
