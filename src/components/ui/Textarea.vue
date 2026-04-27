<script setup lang="ts">
const model = defineModel<string>({ default: '' });

const props = withDefaults(
  defineProps<{
    id: string;
    label: string;
    placeholder?: string;
    rows?: number;
  }>(),
  {
    placeholder: '',
    rows: 4,
  },
);
</script>

<template>
  <label :for="props.id" class="field">
    <span class="field__label">{{ props.label }}</span>
    <textarea
      :id="props.id"
      v-model="model"
      class="field__control"
      :rows="props.rows"
      :placeholder="props.placeholder"
    />
  </label>
</template>

<style scoped>
.field {
  display: grid;
  gap: var(--space-2);
}

.field__label {
  font-weight: 500;
}

.field__control {
  width: 100%;
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  resize: vertical;
}

.field__control:focus {
  outline: 2px solid color-mix(in srgb, var(--color-primary-soft) 70%, white);
  border-color: var(--color-primary-soft);
}
</style>
