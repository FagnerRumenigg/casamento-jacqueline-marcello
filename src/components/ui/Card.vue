<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
  }>(),
  {
    padding: 'md',
    hover: false,
  },
);
</script>

<template>
  <section
    class="ui-card"
    :class="[
      `ui-card--padding-${props.padding}`,
      { 'ui-card--hover': props.hover },
    ]"
  >
    <slot />
  </section>
</template>

<style scoped>
.ui-card {
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

/* padding control */
.ui-card--padding-none {
  padding: 0;
}

.ui-card--padding-sm {
  padding: 0.75rem;
}

.ui-card--padding-md {
  padding: 1rem;
}

.ui-card--padding-lg {
  padding: 1.5rem;
}

/* hover opcional */
.ui-card--hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}
</style>
