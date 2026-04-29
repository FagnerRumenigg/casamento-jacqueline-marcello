<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

import GiftCard from '../components/gift/GiftCard.vue';
import { gifts } from '../data/gifts';
import { useGiftCart } from '../stores/giftCart';
import type { Gift } from '../types/gift';

// store
const { addGift } = useGiftCart();

// toast
const showCartNotice = ref(false);
const noticeMessage = ref('');

let noticeTimeout: number | null = null;

function openNotice(message: string): void {
  noticeMessage.value = message;
  showCartNotice.value = true;

  if (noticeTimeout) clearTimeout(noticeTimeout);

  noticeTimeout = window.setTimeout(() => {
    showCartNotice.value = false;
  }, 1800);
}

function handlePresentear(gift: Gift): void {
  addGift(gift);
  openNotice(`${gift.name} adicionado 😄`);
}

onBeforeUnmount(() => {
  if (noticeTimeout) clearTimeout(noticeTimeout);
});
</script>

<template>
  <section class="page-container gifts-page">
    <header class="intro">
      <h1 class="page-title">Lista de Presentes</h1>
      <p class="page-subtitle">
        Sua presença já vale muito — mas dá pra caprichar 😏
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
      <p v-if="showCartNotice" class="cart-notice">
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
  max-width: 720px;
  margin-inline: auto;
}

.gift-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: var(--space-6);
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
</style>
