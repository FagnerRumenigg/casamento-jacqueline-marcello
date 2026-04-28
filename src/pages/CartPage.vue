<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import PixModal from '../components/pix/PixModal.vue';
import Button from '../components/ui/Button.vue';
import Card from '../components/ui/Card.vue';
import { useGiftCart } from '../stores/giftCart';

const router = useRouter();

const {
  cartItems,
  cartTotal,
  hasItems,
  firstGiftId,
  // selectedGift removido pois não é utilizado
  removeGift,
  addGift,
} = useGiftCart();
const isPixModalOpen = ref(false);

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const totalItemsLabel = computed(() =>
  cartItems.value.reduce((total, item) => total + item.quantity, 0),
);

function handleGoToSeal(): void {
  if (!firstGiftId.value) {
    return;
  }

  router.push({
    path: '/selo',
    query: {
      giftId: firstGiftId.value,
    },
  });
}

function handleOpenPixModal(): void {
  isPixModalOpen.value = true;
}

function handleClosePixModal(): void {
  isPixModalOpen.value = false;
}
</script>

<template>
  <section class="page-container cart-page">
    <header class="intro">
      <h1 class="page-title">Carrinho de Presentes</h1>
      <p class="page-subtitle">
        Revise seus presentes e siga para a criação dos selos.
      </p>
    </header>

    <div v-if="!hasItems" class="empty-state surface-card">
      <h2>Seu carrinho está vazio</h2>
      <p>Escolha um presente na lista para continuar.</p>
      <RouterLink to="/">
        <Button>Voltar para presentes</Button>
      </RouterLink>
    </div>

    <div v-else class="cart-grid">
      <Card class="cart-list">
        <h2>Itens selecionados</h2>

        <ul>
          <li v-for="item in cartItems" :key="item.gift.id" class="cart-item">
            <div class="item-main">
              <strong>{{ item.gift.name }}</strong>
              <span>{{ formatter.format(item.gift.price) }}</span>
            </div>
            <div class="cart-qty-controls">
              <button
                class="qty-btn"
                aria-label="Diminuir quantidade"
                @click="
                  () =>
                    item.quantity > 1 &&
                    (item.quantity--,
                    removeGift(item.gift.id),
                    addGift(item.gift))
                "
                :disabled="item.quantity <= 1"
                type="button"
              >
                -
              </button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button
                class="qty-btn"
                aria-label="Aumentar quantidade"
                @click="() => addGift(item.gift)"
                type="button"
              >
                +
              </button>
            </div>
            <Button variant="ghost" @click="removeGift(item.gift.id)">
              Remover
            </Button>
          </li>
        </ul>
      </Card>

      <Card class="cart-summary">
        <h2>Resumo</h2>
        <p>{{ totalItemsLabel }} item(ns)</p>
        <p class="total">{{ formatter.format(cartTotal) }}</p>

        <Button :full-width="true" @click="handleOpenPixModal">
          Presentear com amor &#10084;
        </Button>

        <Button variant="ghost" :full-width="true" @click="handleGoToSeal">
          Ir para criação do selo
        </Button>
      </Card>
    </div>

    <PixModal
      :open="isPixModalOpen"
      :cart-items="cartItems"
      :amount="cartTotal"
      @close="handleClosePixModal"
    />
  </section>
</template>

<style scoped>
.cart-page {
  display: grid;
  gap: var(--space-8);
}

.intro {
  text-align: center;
}

.empty-state {
  max-width: 680px;
  margin-inline: auto;
  padding: var(--space-8);
  text-align: center;
  display: grid;
  gap: var(--space-4);
}

.empty-state h2,
.empty-state p {
  margin: 0;
}

.cart-grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: minmax(0, 1fr);
}

.cart-list,
.cart-summary {
  padding: var(--space-6);
}

.cart-list h2,
.cart-summary h2 {
  margin: 0 0 var(--space-4);
  color: var(--color-primary);
  font-family: var(--font-display);
}

.cart-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-3);
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  flex-wrap: wrap;
}

.cart-qty-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}
.qty-btn {
  background: var(--color-surface-muted);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-pill);
  width: 28px;
  height: 28px;
  font-size: 1.1rem;
  color: var(--color-primary);
  cursor: pointer;
  transition: background 0.15s;
}
.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-value {
  min-width: 1.5em;
  text-align: center;
  font-weight: 600;
  color: var(--color-primary);
}

.item-main {
  display: grid;
  gap: var(--space-1);
}

.item-main strong {
  font-family: var(--font-display);
}

.item-main span {
  color: var(--color-text-muted);
}

.cart-summary {
  display: grid;
  gap: var(--space-3);
  align-content: start;
}

.cart-summary p {
  margin: 0;
}

.total {
  font-size: 2rem;
  color: var(--color-primary);
  font-family: var(--font-display);
}

@media (min-width: 980px) {
  .cart-grid {
    grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
    align-items: start;
  }
}
</style>
