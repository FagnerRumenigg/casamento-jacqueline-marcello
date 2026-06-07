<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGiftCart } from '../../stores/giftCart';
import Input from '../ui/Input.vue';
import Modal from '../ui/Modal.vue';
import Button from '../ui/Button.vue';

const route = useRoute();
const router = useRouter();
const { cartCount } = useGiftCart();

const isGiftsPage = computed(() => route.path === '/');
const isCardPage = computed(() => route.path === '/cartao');
const isCoupleCardsPage = computed(() => route.path === '/noivos/cartoes');
const hasItems = computed(() => cartCount.value > 0);

const isAccessModalOpen = ref(false);
const coupleCardsKey = ref('');

function openCoupleCardsModal(): void {
  coupleCardsKey.value = '';
  isAccessModalOpen.value = true;
}

async function submitCoupleCardsAccess(): Promise<void> {
  if (!coupleCardsKey.value.trim()) {
    return;
  }

  isAccessModalOpen.value = false;

  await router.push({
    name: 'couple-cards',
    query: { key: coupleCardsKey.value.trim() },
  });
}
</script>

<template>
  <header>
    <div class="desktop-header">
      <div class="page-container header-content">
        <div class="brand">Jacqueline e Marcello</div>

        <nav class="desktop-nav">
          <RouterLink
            to="/"
            class="nav-link"
            :class="{ 'is-active': isGiftsPage }"
          >
            🎁
          </RouterLink>

          <RouterLink
            to="/cartao"
            class="nav-link cart-link"
            :class="{ 'is-active': isCardPage }"
          >
            💌
            <span v-if="hasItems" class="cart-badge">
              {{ cartCount }}
            </span>
          </RouterLink>

          <button
            type="button"
            class="nav-link nav-button"
            :class="{ 'is-active': isCoupleCardsPage }"
            @click="openCoupleCardsModal"
            aria-label="Cartões dos noivos"
            title="Cartões dos noivos"
          >
            🔐
          </button>
        </nav>
      </div>
    </div>

    <nav class="mobile-nav">
      <RouterLink
        to="/"
        class="mobile-link"
        :class="{ 'is-active': isGiftsPage }"
      >
        <span class="icon">🎁</span>
        <span class="label">Presentes</span>
      </RouterLink>

      <RouterLink
        to="/cartao"
        class="mobile-link"
        :class="{ 'is-active': isCardPage }"
      >
        <span class="icon">💌</span>
        <span class="label">Cartões</span>

        <span v-if="hasItems" class="cart-badge mobile-badge">
          {{ cartCount }}
        </span>
      </RouterLink>

      <button
        type="button"
        class="mobile-link mobile-button"
        :class="{ 'is-active': isCoupleCardsPage }"
        @click="openCoupleCardsModal"
        aria-label="Cartões dos noivos"
      >
        <span class="icon">🔐</span>
        <span class="label">Noivos</span>
      </button>
    </nav>

    <Modal v-model="isAccessModalOpen" title="Acesso dos noivos">
      <form class="access-form" @submit.prevent="submitCoupleCardsAccess">
        <p class="access-text">
          Digite a chave para acessar a área com os cartões enviados.
        </p>

        <Input
          v-model="coupleCardsKey"
          label="Chave de acesso"
          placeholder="Digite a chave"
          type="password"
          :required="true"
        />

        <Button type="submit" fullWidth>
          Entrar na área dos noivos
        </Button>
      </form>
    </Modal>
  </header>
</template>

<style scoped>
.desktop-header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 30;
  height: var(--header-height);
  border-bottom: 1px solid var(--color-surface-border);
  backdrop-filter: blur(8px);
  background: color-mix(in srgb, white 82%, transparent);
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.65rem;
  color: var(--color-primary);
}

.desktop-nav {
  display: flex;
  gap: var(--space-6);
  align-items: center;
}

.nav-link {
  position: relative;
  font-size: 1.4rem;
  color: var(--color-text-muted);
  transition: color 0.2s;
}

.nav-button,
.mobile-button {
  border: none;
  background: transparent;
  padding: 0;
  font: inherit;
}

.nav-link:hover,
.nav-link.is-active {
  color: var(--color-primary);
}

.cart-link {
  position: relative;
}

.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  height: 72px;
  display: none;
  border-top: 1px solid var(--color-surface-border);
  background: color-mix(in srgb, white 92%, transparent);
  backdrop-filter: blur(10px);
}

.mobile-link {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-decoration: none;
  color: var(--color-text-muted);
  transition: all 0.2s ease;
}

.icon {
  font-size: 1.4rem;
  line-height: 1;
}

.label {
  font-size: 0.72rem;
  letter-spacing: 0.3px;
}

.mobile-link.is-active {
  color: var(--color-primary);
  font-weight: 600;
}

.mobile-link.is-active::after {
  content: '';
  position: absolute;
  bottom: 6px;
  width: 22px;
  height: 3px;
  border-radius: 2px;
  background: var(--color-primary);
}

.mobile-link:active {
  transform: scale(0.95);
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -10px;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.mobile-badge {
  top: 6px;
  right: 28%;
}

.access-form {
  display: grid;
  gap: var(--space-4);
}

.access-text {
  margin: 0;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .desktop-header {
    display: none;
  }

  .mobile-nav {
    display: flex;
  }
}
</style>
