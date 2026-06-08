<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { Gift } from '../../types/gift';
import Button from '../ui/Button.vue';
import Card from '../ui/Card.vue';

const props = defineProps<{
  gift: Gift;
}>();

const emit = defineEmits<{
  presentear: [gift: Gift];
  preview: [gift: Gift];
}>();

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const fixedDescription =
  'Tem algo especial que queira presentear? Nessa opção você pode editar o título e o valor que quiser que eles vão para o carrinho e preview do cartão.';

const editableTitle = ref(props.gift.name);
const editablePrice = ref(formatPriceInput(props.gift.price));
const priceWidth = ref(7);

watch(
  () => props.gift,
  (gift) => {
    editableTitle.value = gift.name;
    editablePrice.value = formatPriceInput(gift.price);
    priceWidth.value = Math.max(7, editablePrice.value.length + 1);
  },
  { immediate: true },
);

const isCustomizable = computed(() => !!props.gift.isCustomizable);

const currentGift = computed<Gift>(() => {
  if (!isCustomizable.value) {
    return props.gift;
  }

  const parsedPrice = Number.parseFloat(String(editablePrice.value ?? ''));
  const title = editableTitle.value.trim() || props.gift.name;

  return {
    ...props.gift,
    name: title,
    description: fixedDescription,
    dynamicMessage: title,
    price: Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : props.gift.price,
  };
});

function formatPriceInput(value: number): string {
  const cents = Math.round(Number(value) * 100);
  return (cents / 100).toFixed(2);
}

function normalizePriceInput(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  const normalized = digits.padStart(3, '0');
  const integerPart = normalized.slice(0, -2) || '0';
  const decimalPart = normalized.slice(-2);

  return `${Number(integerPart)}.${decimalPart}`;
}

function handlePriceInput(event: Event): void {
  const target = event.target as HTMLInputElement | null;
  if (!target) return;

  editablePrice.value = normalizePriceInput(target.value);
  priceWidth.value = Math.max(7, editablePrice.value.length + 1);
}

function handleGiftClick(): void {
  emit('presentear', currentGift.value);
}

function handlePreviewClick(): void {
  if (!props.gift.imageUrl) return;
  emit('preview', currentGift.value);
}
</script>

<template>
  <Card class="gift-card">
    <div
      class="gift-card__image-wrap"
      :class="{ 'gift-card__image-wrap--clickable': props.gift.imageUrl }"
      @click="handlePreviewClick"
    >
      <img
        v-if="props.gift.imageUrl"
        :src="props.gift.imageUrl"
        :alt="props.gift.name"
        class="gift-card__image"
      />
      <div v-else class="gift-card__image-placeholder">
        Imagem em breve
      </div>
    </div>

    <div class="gift-card__content">
      <input
        v-if="isCustomizable"
        v-model="editableTitle"
        class="gift-card__title-input"
        type="text"
        aria-label="Título do presente"
      />
      <h3 v-else>{{ currentGift.name }}</h3>

      <p>{{ isCustomizable ? fixedDescription : props.gift.description }}</p>

      <div class="gift-card__footer">
        <strong v-if="!isCustomizable">{{ formatter.format(currentGift.price) }}</strong>
        <div v-else class="gift-card__price-inline">
          <span>R$</span>
          <input
            :value="editablePrice"
            class="gift-card__price-input"
            :style="{ width: `${priceWidth}ch` }"
            type="text"
            inputmode="numeric"
            aria-label="Valor do presente"
            @input="handlePriceInput"
          />
        </div>
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
  border: none;
  padding: 0;
  width: 100%;
}

.gift-card__image-wrap--clickable {
  cursor: zoom-in;
}

.gift-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gift-card__image-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding: var(--space-4);
  text-align: center;
  color: var(--color-text-muted);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
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

.gift-card__title-input {
  width: 100%;
  border: 1px dashed color-mix(in srgb, var(--color-primary) 32%, var(--color-surface-border));
  border-radius: 12px;
  background: color-mix(in srgb, var(--color-surface) 92%, white);
  padding: 0.45rem 0.7rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--color-primary);
}

.gift-card__title-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 18%, transparent);
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

.gift-card__price-inline {
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
  color: var(--color-primary);
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
}

.gift-card__price-inline span {
  line-height: 1;
}

.gift-card__price-input {
  width: 7ch;
  border: 1px dashed color-mix(in srgb, var(--color-primary) 32%, var(--color-surface-border));
  border-radius: 10px;
  background: color-mix(in srgb, var(--color-surface) 92%, white);
  padding: 0.25rem 0.5rem;
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--color-primary);
  font-weight: 700;
}

.gift-card__price-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 18%, transparent);
}
</style>
