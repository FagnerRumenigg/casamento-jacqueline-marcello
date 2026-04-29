<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'ghost';
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    type: 'button',
    variant: 'primary',
    fullWidth: false,
    disabled: false,
    loading: false,
  },
);
</script>

<template>
  <button
    :type="props.type"
    class="ui-button"
    :disabled="props.disabled || props.loading"
    :class="[
      `ui-button--${props.variant}`,
      { 'ui-button--full': props.fullWidth },
      { 'is-loading': props.loading },
    ]"
  >
    <span v-if="props.loading" class="spinner" />
    <slot />
  </button>
</template>

<style scoped>
.ui-button {
  border: none;
  border-radius: var(--radius-pill);
  padding: var(--space-3) var(--space-6);
  cursor: pointer;
  transition:
    transform 120ms ease,
    background 160ms ease,
    opacity 120ms ease;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.ui-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.ui-button:active:not(:disabled) {
  transform: translateY(0);
}

.ui-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* variantes */
.ui-button--primary {
  background: var(--color-primary-soft);
  color: #3b2f00;
}

.ui-button--primary:hover:not(:disabled) {
  background: var(--color-primary-soft-hover);
}

.ui-button--ghost {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-surface-border);
}

.ui-button--full {
  width: 100%;
}

/* loading */
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
