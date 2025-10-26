<template>
  <div
    v-if="show"
    class="context-menu"
    :style="{ top: y + 'px', left: x + 'px' }"
    @click.stop
  >
    <button class="menu-item" @click="handleRename">✏️ Rename</button>
    <button class="menu-item" @click="handleDelete">🗑️ Delete</button>
    <div class="menu-divider"></div>
    <button class="menu-item" @click="handleNewFolder">📁 New Folder</button>
    <button class="menu-item" @click="handleNewFile">📄 New File</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  x: number;
  y: number;
  itemType: "folder" | "file";
}>();

const emit = defineEmits<{
  rename: [];
  delete: [];
  "new-folder": [];
  "new-file": [];
  close: [];
}>();

const handleRename = () => {
  emit("rename");
  emit("close");
};

const handleDelete = () => {
  emit("delete");
  emit("close");
};

const handleNewFolder = () => {
  emit("new-folder");
  emit("close");
};

const handleNewFile = () => {
  emit("new-file");
  emit("close");
};
</script>

<style scoped>
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 160px;
  overflow: hidden;
}

.menu-item {
  display: block;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
  color: #333;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.menu-divider {
  height: 1px;
  background-color: #f0f0f0;
  margin: 4px 0;
}
</style>
