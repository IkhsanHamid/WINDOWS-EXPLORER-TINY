<template>
  <div class="breadcrumb">
    <button class="breadcrumb-item home" @click="$emit('navigate', '')">
      🏠 Home
    </button>
    <span v-for="item in items" :key="item.id" class="breadcrumb-sep"> / </span>
    <span v-for="(item, idx) in items" :key="item.id">
      <button class="breadcrumb-item" @click="$emit('navigate', item.id)">
        {{ item.name }}
      </button>
      <span v-if="idx < items.length - 1" class="breadcrumb-sep"> / </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { FolderDTO } from "../types";

defineProps<{
  items: FolderDTO[];
}>();

defineEmits<{
  navigate: [folderId: string];
}>();
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  overflow-x: auto;
  padding: 4px 0;
}

.breadcrumb-item {
  border: none;
  background: none;
  color: #0066cc;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.breadcrumb-item:hover {
  background-color: #e3f2fd;
}

.breadcrumb-item.home {
  color: #333;
  font-weight: 500;
}

.breadcrumb-sep {
  color: #999;
  margin: 0 2px;
}
</style>
