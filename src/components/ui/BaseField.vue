<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    id?: string;
    label: string;
    required?: boolean;
  }>(),
  {
    required: false,
  },
);

// 🔥 gera id automático (compartilhado com filhos)
const fieldId = computed(
  () => props.id ?? `field-${Math.random().toString(36).slice(2, 9)}`,
);

const showAsterisk = computed(() => props.required);
</script>

<template>
  <label :for="fieldId" class="field">
    <span class="field__label">
      {{ props.label }}
      <strong v-if="showAsterisk">*</strong>
    </span>

    <!-- 🔥 AQUI MORA A MÁGICA -->
    <!-- qualquer input/select/textarea entra aqui -->
    <slot :id="fieldId" />
  </label>
</template>

<style scoped>
.field {
  display: grid;
  gap: var(--space-2);
}

.field__label {
  font-weight: 500;
  font-size: 0.9rem;
}

.field :deep(input),
.field :deep(select),
.field :deep(textarea) {
  width: 100%;
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  transition: all 0.15s ease;
  font-size: 0.9rem;
}

.field :deep(input:focus),
.field :deep(select:focus),
.field :deep(textarea:focus) {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px
    color-mix(in srgb, var(--color-primary) 20%, transparent);
}
</style>
