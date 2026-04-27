<script setup lang="ts">
const model = defineModel<string>({ default: '' });

interface SelectOption {
  label: string;
  value: string;
}

const props = defineProps<{
  id: string;
  label: string;
  options: SelectOption[];
}>();
</script>

<template>
  <label :for="props.id" class="field">
    <span class="field__label">{{ props.label }}</span>
    <select :id="props.id" v-model="model" class="field__control">
      <option
        v-for="option in props.options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
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
}

.field__control:focus {
  outline: 2px solid color-mix(in srgb, var(--color-primary-soft) 70%, white);
  border-color: var(--color-primary-soft);
}
</style>
