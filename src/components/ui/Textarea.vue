<script setup lang="ts">
import BaseField from './BaseField.vue';

const model = defineModel<string>({ default: '' });

const props = withDefaults(
  defineProps<{
    id?: string;
    label: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
  }>(),
  {
    placeholder: '',
    rows: 4,
    required: false,
  },
);

</script>

<template>
  <BaseField :label="props.label" :required="props.required" v-slot="{ id }">
    <textarea
      :id="id"
      v-model="model"
      class="field__control"
      :rows="props.rows"
      :placeholder="props.placeholder"
    />
  </BaseField>
</template>

<style scoped>
.field__control {
  width: 100%;
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  font-size: 0.9rem;
  resize: vertical;
  min-height: 90px;
  transition: all 0.15s ease;
}

/* foco padrão bonitão */
.field__control:focus {
  outline: 2px solid color-mix(in srgb, var(--color-primary-soft) 70%, white);
  border-color: var(--color-primary-soft);
}

/* hover suave */
.field__control:hover {
  border-color: var(--color-primary-soft);
}
</style>
