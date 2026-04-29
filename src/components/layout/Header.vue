<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGiftCart } from '../../stores/giftCart';

const route = useRoute();
const { cartCount } = useGiftCart();

const isGiftsPage = computed(() => route.path === '/');
const isCardPage = computed(() => route.path === '/cartao');

const hasItems = computed(() => cartCount.value > 0);
</script>

<template>
  <header>
    <!-- DESKTOP -->
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
            🧾
            <span v-if="hasItems" class="cart-badge">
              {{ cartCount }}
            </span>
          </RouterLink>
        </nav>
      </div>
    </div>

    <!-- MOBILE -->
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
    </nav>
  </header>
</template>

<style scoped>
/* DESKTOP */
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

.nav-link:hover,
.nav-link.is-active {
  color: var(--color-primary);
}

.cart-link {
  position: relative;
}

/* MOBILE */
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

/* item */
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

/* ícone */
.icon {
  font-size: 1.4rem;
  line-height: 1;
}

/* label */
.label {
  font-size: 0.72rem;
  letter-spacing: 0.3px;
}

/* ativo */
.mobile-link.is-active {
  color: var(--color-primary);
  font-weight: 600;
}

/* indicador */
.mobile-link.is-active::after {
  content: '';
  position: absolute;
  bottom: 6px;
  width: 22px;
  height: 3px;
  border-radius: 2px;
  background: var(--color-primary);
}

/* toque */
.mobile-link:active {
  transform: scale(0.95);
}

/* BADGE (desktop) */
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

/* BADGE MOBILE */
.mobile-badge {
  top: 6px;
  right: 28%;
}

/* RESPONSIVO */
@media (max-width: 768px) {
  .desktop-header {
    display: none;
  }

  .mobile-nav {
    display: flex;
  }
}
</style>
