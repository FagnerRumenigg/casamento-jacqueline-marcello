<script setup lang="ts">
import { computed } from 'vue';

const model = defineModel<string>({ default: '' });

const props = withDefaults(
  defineProps<{
    id: string;
    label: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
  }>(),
  {
    placeholder: '',
    type: 'text',
    required: false,
  },
);

const showAsterisk = computed(() => props.required);
</script>

<template>
  <label :for="props.id" class="field">
    <span class="field__label">
      {{ props.label }}
      <strong v-if="showAsterisk" aria-hidden="true">*</strong>
    </span>
    <input
      :id="props.id"
      v-model="model"
      class="field__control"
      :placeholder="props.placeholder"
      :type="props.type"
      :required="props.required"
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
}

.field__control:focus {
  outline: 2px solid color-mix(in srgb, var(--color-primary-soft) 70%, white);
  border-color: var(--color-primary-soft);
}
</style>
