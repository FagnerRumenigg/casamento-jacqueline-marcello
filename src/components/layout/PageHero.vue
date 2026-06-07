<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  description?: string;
  eyebrow?: string;
  logoSrc?: string;
  logoAlt?: string;
}>();

const resolvedLogoSrc = computed(
  () => props.logoSrc ?? `${import.meta.env.BASE_URL}images/logo.png`,
);
const resolvedLogoAlt = computed(
  () => props.logoAlt ?? 'Logo do casamento',
);
</script>

<template>
  <header class="page-hero">
    <img
      v-if="resolvedLogoSrc"
      :src="resolvedLogoSrc"
      :alt="resolvedLogoAlt"
      class="page-hero__logo"
    />

    <p v-if="props.eyebrow" class="page-hero__eyebrow">{{ props.eyebrow }}</p>

    <div class="page-hero__title-row">
      <h1 class="page-hero__title">{{ props.title }}</h1>
      <slot name="title-extra" />
    </div>

    <p v-if="props.description" class="page-hero__description">
      {{ props.description }}
    </p>
  </header>
</template>

<style scoped>
.page-hero {
  display: grid;
  gap: var(--space-2);
  max-width: 720px;
  margin-inline: auto;
  text-align: center;
  justify-items: center;
}

.page-hero__logo {
  width: min(180px, 45vw);
  display: block;
  margin: 0 auto var(--space-2);
}

.page-hero__eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.page-hero__title-row {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.page-hero__title {
  margin: 0;
  font-size: clamp(1.5rem, 2.8vw, 2rem);
}

.page-hero__description {
  margin: 0;
  color: var(--color-text-muted);
  white-space: pre-line;
}
</style>
