<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

import GiftCard from '../components/gift/GiftCard.vue';
import { gifts } from '../data/gifts';
import { useGiftCart } from '../stores/giftCart';
import type { Gift } from '../types/gift';

const { addGift } = useGiftCart();
const showCartNotice = ref(false);
const noticeMessage = ref('');

let noticeTimeout: number | null = null;

function openNotice(message: string): void {
  noticeMessage.value = message;
  showCartNotice.value = true;

  if (noticeTimeout !== null) {
    window.clearTimeout(noticeTimeout);
  }

  noticeTimeout = window.setTimeout(() => {
    showCartNotice.value = false;
    noticeTimeout = null;
  }, 1800);
}

function handlePresentear(gift: Gift): void {
  addGift(gift);
  openNotice(`${gift.name} adicionado ao carrinho.`);
}

onBeforeUnmount(() => {
  if (noticeTimeout !== null) {
    window.clearTimeout(noticeTimeout);
  }
});
</script>

<template>
  <section class="page-container gifts-page">
    <header class="intro">
      <h1 class="page-title">Lista de Presentes</h1>
      <p class="page-subtitle">
        Sua presença é o maior presente, mas se quiser nos mimar, ficaremos
        muito felizes!
      </p>
    </header>

    <div class="gift-grid">
      <GiftCard
        v-for="gift in gifts"
        :key="gift.id"
        :gift="gift"
        @presentear="handlePresentear"
      />
    </div>

    <transition name="cart-notice">
      <p
        v-if="showCartNotice"
        class="cart-notice"
        role="status"
        aria-live="polite"
      >
        {{ noticeMessage }}
      </p>
    </transition>
  </section>
</template>

<style scoped>
.gifts-page {
  display: grid;
  gap: var(--space-10);
}

.intro {
  text-align: center;
  max-width: 760px;
  margin-inline: auto;
}

.gift-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: var(--space-6);
}

.cart-notice {
  position: fixed;
  right: var(--space-5);
  bottom: var(--space-5);
  z-index: 40;
  margin: 0;
  background: color-mix(in srgb, white 92%, var(--color-primary-soft));
  border: 1px solid color-mix(in srgb, var(--color-primary) 18%, white);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-card);
  color: var(--color-text);
  padding: var(--space-2) var(--space-4);
  font-size: 0.92rem;
}

.cart-notice-enter-active,
.cart-notice-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.cart-notice-enter-from,
.cart-notice-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (min-width: 640px) {
  .gift-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .gift-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .cart-notice {
    right: var(--space-4);
    bottom: calc(70px + var(--space-4));
    max-width: calc(100% - 2 * var(--space-4));
  }
}
</style>
