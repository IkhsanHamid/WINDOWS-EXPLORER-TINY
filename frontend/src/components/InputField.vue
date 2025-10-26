<template>
  <div class="input-field">
    <label v-if="label" class="label">{{ label }}</label>
    <input
      :value="modelValue"
      :placeholder="placeholder"
      class="input"
      :class="{ 'input-error': error }"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      @keyup.enter="$emit('enter')"
      @keyup.escape="$emit('escape')"
    />
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  label?: string;
  placeholder?: string;
  error?: string;
}>();

defineEmits<{
  "update:modelValue": [value: string];
  enter: [];
  escape: [];
}>();
</script>

<style scoped>
.input-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.input-error {
  border-color: #f44336;
}

.input-error:focus {
  box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.1);
}

.error-message {
  font-size: 12px;
  color: #f44336;
}
</style>
