<script setup lang="ts">
import type { Gift } from '../../types/gift';
import Button from '../ui/Button.vue';
import Card from '../ui/Card.vue';

const props = defineProps<{
  gift: Gift;
}>();

const emit = defineEmits<{
  presentear: [gift: Gift];
}>();

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function handleGiftClick(): void {
  emit('presentear', props.gift);
}
</script>

<template>
  <Card class="gift-card">
    <div class="gift-card__image-wrap">
      <img
        :src="props.gift.imageUrl"
        :alt="props.gift.name"
        class="gift-card__image"
      />
    </div>

    <div class="gift-card__content">
      <h3>{{ props.gift.name }}</h3>
      <p>{{ props.gift.description }}</p>

      <div class="gift-card__footer">
        <strong>{{ formatter.format(props.gift.price) }}</strong>
        <Button @click="handleGiftClick">Presentear</Button>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.gift-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;
}

.gift-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-soft);
}

.gift-card__image-wrap {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--color-surface-muted);
}

.gift-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gift-card__content {
  padding: var(--space-6);
  display: grid;
  gap: var(--space-4);
}

.gift-card h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.35rem;
}

.gift-card p {
  margin: 0;
  color: var(--color-text-muted);
  min-height: 52px;
}

.gift-card__footer {
  border-top: 1px solid var(--color-surface-border);
  padding-top: var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.gift-card__footer strong {
  color: var(--color-primary);
  font-family: var(--font-display);
  font-size: 1.35rem;
}
</style>
