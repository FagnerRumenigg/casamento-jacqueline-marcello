<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useGiftCart } from '../../stores/giftCart';

const route = useRoute();
const { cartCount } = useGiftCart();

const isGiftsPage = computed(() => route.path === '/');
const isSealPage = computed(() => route.path === '/selo');
const isCartPage = computed(() => route.path === '/carrinho');
</script>

<template>
  <header>
    <div class="desktop-header">
      <div class="page-container header-content">
        <div class="brand">Jacqueline e Marcello</div>
        <nav class="desktop-nav" aria-label="Navegação principal">
          <RouterLink
            to="/"
            class="nav-link"
            :class="{ 'is-active': isGiftsPage }"
          >
            <span class="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" class="nav-icon-svg">
                <path
                  d="M12 7V21M3 11H21M5 7H19C20.1046 7 21 7.89543 21 9V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9C3 7.89543 3.89543 7 5 7Z"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 7H9.5C8.11929 7 7 5.88071 7 4.5C7 3.11929 8.11929 2 9.5 2C11.5 2 12 4 12 4V7Z"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 7H14.5C15.8807 7 17 5.88071 17 4.5C17 3.11929 15.8807 2 14.5 2C12.5 2 12 4 12 4V7Z"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span class="sr-only">Presentes</span>
          </RouterLink>
          <RouterLink
            to="/selo"
            class="nav-link"
            :class="{ 'is-active': isSealPage }"
          >
            <span class="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" class="nav-icon-svg">
                <path
                  d="M20 12L12 20L3 11V4H10L20 12Z"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
              </svg>
            </span>
            <span class="sr-only">Selos</span>
          </RouterLink>
          <RouterLink
            to="/carrinho"
            class="nav-link"
            :class="{ 'is-active': isCartPage }"
            aria-label="Carrinho"
          >
            <span class="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" class="nav-icon-svg">
                <circle cx="9" cy="20" r="1.5" fill="currentColor" />
                <circle cx="17" cy="20" r="1.5" fill="currentColor" />
                <path
                  d="M3 4H5L7.2 14.2C7.38757 15.0558 8.14696 15.6667 9.02286 15.6667H16.8C17.6759 15.6667 18.4353 15.0558 18.6229 14.2L20 8H6.2"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span class="sr-only">Carrinho</span>
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </RouterLink>
        </nav>
      </div>
    </div>

    <nav class="mobile-nav" aria-label="Navegação mobile">
      <RouterLink
        to="/"
        class="mobile-link"
        :class="{ 'is-active': isGiftsPage }"
      >
        <span class="nav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" class="nav-icon-svg">
            <path
              d="M12 7V21M3 11H21M5 7H19C20.1046 7 21 7.89543 21 9V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9C3 7.89543 3.89543 7 5 7Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 7H9.5C8.11929 7 7 5.88071 7 4.5C7 3.11929 8.11929 2 9.5 2C11.5 2 12 4 12 4V7Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 7H14.5C15.8807 7 17 5.88071 17 4.5C17 3.11929 15.8807 2 14.5 2C12.5 2 12 4 12 4V7Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        Presentes
      </RouterLink>
      <RouterLink
        to="/selo"
        class="mobile-link"
        :class="{ 'is-active': isSealPage }"
      >
        <span class="nav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" class="nav-icon-svg">
            <path
              d="M20 12L12 20L3 11V4H10L20 12Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
          </svg>
        </span>
        Selos
      </RouterLink>
      <RouterLink
        to="/carrinho"
        class="mobile-link"
        :class="{ 'is-active': isCartPage }"
        aria-label="Carrinho"
      >
        <span class="nav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" class="nav-icon-svg">
            <circle cx="9" cy="20" r="1.5" fill="currentColor" />
            <circle cx="17" cy="20" r="1.5" fill="currentColor" />
            <path
              d="M3 4H5L7.2 14.2C7.38757 15.0558 8.14696 15.6667 9.02286 15.6667H16.8C17.6759 15.6667 18.4353 15.0558 18.6229 14.2L20 8H6.2"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        Carrinho
        <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
      </RouterLink>
    </nav>
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
  gap: var(--space-8);
  align-items: center;
}

.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  padding: var(--space-2) 0;
  color: var(--color-text-muted);
  border-bottom: 2px solid transparent;
  transition:
    color 180ms ease,
    border-color 180ms ease;
}

.nav-icon {
  width: 1.15rem;
  height: 1.15rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.nav-icon-svg {
  width: 100%;
  height: 100%;
}

.nav-link:hover,
.nav-link.is-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  height: 70px;
  display: none;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid var(--color-surface-border);
  background: color-mix(in srgb, white 90%, transparent);
  backdrop-filter: blur(8px);
}

.mobile-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-family: var(--font-display);
  color: var(--color-text-muted);
}

.mobile-link .nav-icon {
  width: 1rem;
  height: 1rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.cart-badge {
  min-width: 1.25rem;
  height: 1.25rem;
  padding-inline: var(--space-1);
  border-radius: var(--radius-pill);
  background: var(--color-primary-soft);
  color: #3b2f00;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
}

.mobile-link.is-active {
  color: var(--color-primary);
  font-weight: 600;
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
