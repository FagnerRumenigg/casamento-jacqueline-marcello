<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';

import GiftCard from '../components/gift/GiftCard.vue';
import PageHero from '../components/layout/PageHero.vue';
import Button from '../components/ui/Button.vue';
import { gifts } from '../data/gifts';
import { giftSections } from '../data/giftSections';
import { useGiftCart } from '../stores/giftCart';
import type { Gift } from '../types/gift';

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const router = useRouter();
const { addGift, cartCount, cartTotal, hasItems } = useGiftCart();

const showCartNotice = ref(false);
const noticeMessage = ref('');
const selectedPreviewGift = ref<Gift | null>(null);
const openSectionIds = ref(new Set(giftSections.map((section) => section.id)));
let noticeTimeout: number | null = null;

const cartSummaryLabel = computed(() =>
  cartCount.value === 1 ? '1 presente selecionado' : `${cartCount.value} presentes selecionados`,
);

const pageDescription = `Sua presença já vale muito, mas dá pra caprichar.
1. Escolha o(s) presente(s) que desejar clicando em "Presentear". Eles serão adicionados automaticamente ao seu pedido.
2. Em seguida, acesse a aba "Cartões". Os presentes selecionados estarão disponíveis para conferência.
3. Escreva uma mensagem para os noivos e envie o cartão.
4. Um QR Code será exibido para que você realize o pagamento via Pix.
5. Faça o Pix e pronto! Seu presente será enviado aos noivos.`;

const giftsBySection = computed(() =>
  giftSections.map((section) => ({
    ...section,
    gifts: section.giftIds
      .map((giftId) => gifts.find((gift) => gift.id === giftId))
      .filter((gift): gift is Gift => !!gift),
  })),
);

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
  openNotice(`${gift.name} adicionado`);
}

function openGiftPreview(gift: Gift): void {
  selectedPreviewGift.value = gift;
}

function closeGiftPreview(): void {
  selectedPreviewGift.value = null;
}

function isSectionOpen(sectionId: string): boolean {
  return openSectionIds.value.has(sectionId);
}

function toggleSection(sectionId: string): void {
  const next = new Set(openSectionIds.value);

  if (next.has(sectionId)) {
    next.delete(sectionId);
  } else {
    next.add(sectionId);
  }

  openSectionIds.value = next;
}

async function goToCardPage(): Promise<void> {
  await router.push('/cartao');
}

onBeforeUnmount(() => {
  if (noticeTimeout) clearTimeout(noticeTimeout);
});
</script>

<template>
  <section class="page-container gifts-page">
    <PageHero
      title="Lista de Presentes"
      :description="pageDescription"
    />

    <section v-if="hasItems" class="cart-cta-card">
      <div class="cart-cta-copy">
        <strong>{{ cartSummaryLabel }}</strong>
        <p>
          Agora crie seu cartão para os noivos. Depois disso, o pagamento será liberado.
          Total atual: {{ formatter.format(cartTotal) }}
        </p>
      </div>

      <Button @click="goToCardPage">
        Continuar para criar o cartão
      </Button>
    </section>

    <div class="gift-sections">
      <section
        v-for="section in giftsBySection"
        :key="section.id"
        class="gift-section"
      >
        <button
          type="button"
          class="gift-section__header"
          @click="toggleSection(section.id)"
          :aria-expanded="isSectionOpen(section.id)"
        >
          <span class="gift-section__header-main">
            <span class="gift-section__icon">{{ section.icon }}</span>
            <h2 class="gift-section__title">{{ section.title }}</h2>
          </span>

          <span
            class="gift-section__toggle"
            :class="{ 'gift-section__toggle--open': isSectionOpen(section.id) }"
          >
            ⌄
          </span>
        </button>

        <transition name="section-collapse">
          <div v-if="isSectionOpen(section.id)" class="gift-grid">
            <GiftCard
              v-for="gift in section.gifts"
              :key="gift.id"
              :gift="gift"
              @presentear="handlePresentear"
              @preview="openGiftPreview"
            />
          </div>
        </transition>
      </section>
    </div>

    <transition name="cart-notice">
      <p v-if="showCartNotice" class="cart-notice">
        {{ noticeMessage }}
      </p>
    </transition>

    <transition name="cta-float">
      <div v-if="hasItems" class="cart-cta-floating">
        <div class="cart-cta-floating__copy">
          <strong>{{ cartSummaryLabel }}</strong>
          <span>{{ formatter.format(cartTotal) }}</span>
        </div>

        <Button @click="goToCardPage">
          Ir para criar o cartão
        </Button>
      </div>
    </transition>

    <teleport to="body">
      <transition name="viewer">
        <div
          v-if="selectedPreviewGift"
          class="viewer-backdrop"
          @click.self="closeGiftPreview"
        >
          <section class="viewer-modal" role="dialog" aria-modal="true">
            <img
              :src="selectedPreviewGift.imageUrl"
              :alt="selectedPreviewGift.name"
              class="viewer-image"
            />

            <div class="viewer-meta">
              <strong>{{ selectedPreviewGift.name }}</strong>
              <span>{{ formatter.format(selectedPreviewGift.price) }}</span>
              <p>{{ selectedPreviewGift.description }}</p>
            </div>
          </section>
        </div>
      </transition>
    </teleport>
  </section>
</template>

<style scoped>
.gifts-page {
  display: grid;
  gap: var(--space-10);
}

.cart-cta-card {
  display: none;
}

.cart-cta-copy {
  display: grid;
  gap: var(--space-2);
}

.cart-cta-copy strong {
  font-family: var(--font-display);
  color: var(--color-primary);
  font-size: 1.2rem;
}

.cart-cta-copy p {
  margin: 0;
  color: var(--color-text-muted);
}

.gift-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: var(--space-6);
}

.gift-sections {
  display: grid;
  gap: var(--space-9);
}

.gift-section {
  display: grid;
  gap: var(--space-5);
}

.gift-section + .gift-section {
  position: relative;
  padding-top: var(--space-8);
}

.gift-section + .gift-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(220px, 55%);
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--color-primary) 35%, var(--color-surface-border)),
    transparent
  );
}

.gift-section__header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-surface-border);
  border-top: none;
  border-left: none;
  border-right: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.gift-section__header-main {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.gift-section__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--color-surface-muted) 68%, white);
  font-size: 1.4rem;
  flex-shrink: 0;
}

.gift-section__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2vw, 1.45rem);
  color: var(--color-primary);
}

.gift-section__toggle {
  display: inline-grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-surface-muted) 70%, white);
  color: var(--color-primary);
  font-size: 1.15rem;
  line-height: 1;
  padding-top: 2px;
  transition: transform 160ms ease;
  flex-shrink: 0;
}

.gift-section__toggle--open {
  transform: rotate(180deg);
}

.cart-cta-floating {
  position: fixed;
  left: 50%;
  bottom: 84px;
  z-index: 35;
  transform: translateX(-50%);
  width: min(calc(100% - 24px), 640px);
  padding: 0.8rem;
  border-radius: 20px;
  background: color-mix(in srgb, white 92%, transparent);
  border: 1px solid var(--color-surface-border);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.14);
  backdrop-filter: blur(10px);
  display: grid;
  gap: 0.7rem;
}

.cart-cta-floating__copy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.cart-cta-floating__copy strong {
  color: var(--color-primary);
}

.cart-cta-floating__copy span {
  color: var(--color-text-muted);
  font-weight: 700;
}

.cta-float-enter-active,
.cta-float-leave-active,
.viewer-enter-active,
.viewer-leave-active {
  transition: opacity 180ms ease;
}

.cta-float-enter-from,
.cta-float-leave-to,
.viewer-enter-from,
.viewer-leave-to {
  opacity: 0;
}

.section-collapse-enter-active,
.section-collapse-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.section-collapse-enter-from,
.section-collapse-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.viewer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 95;
  background: rgba(20, 16, 4, 0.72);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: var(--space-5);
}

.viewer-modal {
  width: min(100%, 980px);
  max-height: 92vh;
  overflow: auto;
  padding: var(--space-5);
  border-radius: 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
  display: grid;
  gap: var(--space-4);
}

.viewer-image {
  width: 100%;
  max-height: 72vh;
  object-fit: contain;
  background: color-mix(in srgb, var(--color-surface-muted) 78%, white);
  border-radius: 14px;
}

.viewer-meta {
  display: grid;
  gap: var(--space-2);
  text-align: left;
}

.viewer-meta strong {
  font-family: var(--font-display);
  color: var(--color-primary);
  font-size: 1.2rem;
}

.viewer-meta span,
.viewer-meta p {
  margin: 0;
  color: var(--color-text-muted);
}

@media (min-width: 640px) {
  .gift-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 900px) {
  .cart-cta-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-5);
    padding: var(--space-5);
    border-radius: 22px;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(250, 247, 241, 0.98));
    border: 1px solid var(--color-surface-border);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  }

  .cart-cta-floating {
    bottom: 24px;
    width: min(calc(100% - 32px), 520px);
  }
}

@media (min-width: 1024px) {
  .gift-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .viewer-modal {
    padding: var(--space-4);
  }
}
</style>
