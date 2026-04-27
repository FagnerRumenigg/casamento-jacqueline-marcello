<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'ghost';
    fullWidth?: boolean;
  }>(),
  {
    type: 'button',
    variant: 'primary',
    fullWidth: false,
  },
);
</script>

<template>
  <button
    :type="props.type"
    class="ui-button"
    :class="[
      `ui-button--${props.variant}`,
      { 'ui-button--full': props.fullWidth },
    ]"
  >
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
    background 160ms ease;
  font-weight: 600;
}

.ui-button:hover {
  transform: translateY(-1px);
}

.ui-button:active {
  transform: translateY(0);
}

.ui-button--primary {
  background: var(--color-primary-soft);
  color: #3b2f00;
}

.ui-button--primary:hover {
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
</style>
