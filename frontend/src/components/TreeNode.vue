<template>
  <div class="tree-node">
    <div class="node-content">
      <button
        v-if="hasChildren"
        class="expand-btn"
        :class="{ expanded: isExpanded }"
        @click="$emit('toggle', node.id)"
        :aria-label="`Toggle ${node.name}`"
      >
        ▶
      </button>
      <div v-else class="expand-btn-placeholder"></div>

      <button
        class="folder-btn"
        @click="$emit('select', node.id)"
        @contextmenu.prevent="showContextMenu"
        :aria-label="`Select ${node.name}`"
      >
        📁 {{ node.name }}
      </button>
    </div>

    <!-- Added context menu for tree nodes -->
    <context-menu
      :show="contextMenuShow"
      :x="contextMenuX"
      :y="contextMenuY"
      item-type="folder"
      @delete="$emit('delete', node.id)"
      @rename="$emit('rename', node.id)"
      @close="contextMenuShow = false"
    />

    <div v-if="isExpanded && node.children" class="children">
      <tree-node
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        @select="$emit('select', $event)"
        @toggle="$emit('toggle', $event)"
        @delete="$emit('delete', $event)"
        @rename="$emit('rename', $event)"
        :is-expanded="isExpandedFn"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import ContextMenu from "./ContextMenu.vue";
import type { FolderTreeNode } from "../types";

const props = defineProps<{
  node: FolderTreeNode;
  isExpanded: (id: string) => boolean;
}>();

const hasChildren = computed(() => Boolean(props.node.children?.length));

defineEmits<{
  select: [folderId: string];
  toggle: [folderId: string];
  delete: [folderId: string];
  rename: [folderId: string];
}>();

const isExpandedFn = props.isExpanded;
const isExpanded = computed(() => isExpandedFn(props.node.id));

const contextMenuShow = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);

const showContextMenu = (event: MouseEvent) => {
  contextMenuShow.value = true;
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
};
</script>

<style scoped>
.tree-node {
  user-select: none;
}

.node-content {
  display: flex;
  align-items: center;
  padding: 4px 4px;
  margin: 0 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.node-content:hover {
  background-color: #e0e0e0;
}

.expand-btn,
.expand-btn-placeholder {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.expand-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  color: #666;
  transition: transform 0.2s;
}

.expand-btn.expanded {
  transform: rotate(90deg);
}

.expand-btn:hover {
  color: #333;
}

.folder-btn {
  flex: 1;
  border: none;
  background: none;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 13px;
  text-align: left;
  color: #333;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.folder-btn:hover {
  background-color: #d0d0d0;
}

.children {
  margin-left: 12px;
}
</style>
