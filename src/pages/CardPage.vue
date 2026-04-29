<script setup lang="ts">
import html2canvas from 'html2canvas';
import { computed, reactive, ref, watch } from 'vue';

import CardForm from '../components/card/CardForm.vue';
import CardPreview from '../components/card/CardPreview.vue';

import { useUniqueCartGiftNames } from '../composables/useUniqueCartGiftNames';
import { useGiftCart } from '../stores/giftCart';
import { useEasterEgg } from '../composables/useEasterEgg';

import Modal from '../components/ui/Modal.vue';
import Button from '../components/ui/Button.vue';
import Card from '../components/ui/Card.vue';

import type { CardFormState, CardStyle } from '../types/card';

// 💰 PIX
import QRCode from 'qrcode';
import { generatePixPayload } from '../utils/pix';

// 🛒 STORE
const giftCart = useGiftCart();
const { cartItems, cartTotal, addGift, removeGift } = giftCart;

const uniqueGiftNames = useUniqueCartGiftNames();

// 🖼️ GIFT IMAGES: apenas presentes escolhidos no carrinho
const giftImages = computed(() =>
  cartItems.value.map((item) => ({
    label: item.gift.name,
    image: item.gift.imageUrl,
    type: 'gift' as const,
  })),
);

// 🖼️ COMBINAÇÃO FINAL DO CAROUSEL
const easterImages = computed(() =>
  easterEggImages.value.map((image, index) => ({
    label: `Secreto ${index + 1}`,
    image,
    type: 'easter' as const,
  })),
);

const availableImages = computed(() => [
  ...giftImages.value,
  ...easterImages.value,
]);

// 🎨 estilos
const cardStyles: CardStyle[] = [
  {
    id: 'classic',
    label: 'Clássico',
    shape: 'square',
    background: '#fff6d9',
    border: '#c9a22d',
  },
  {
    id: 'modern',
    label: 'Oval',
    shape: 'pill',
    background: '#edf6f9',
    border: '#83c5be',
  },
];

// 🧠 FORM
const form = reactive<CardFormState>({
  guestName: '',
  message: '',
  styleId: cardStyles[0].id,

  backgroundColor: '#ffffff',
  backgroundImage: '',
  backgroundMode: 'color',

  textColor: '#000000',
  fontFamily: "'Noto Serif', serif",
  isBold: false,
  isItalic: false,
});

// ✨ EASTER EGGS
const { easterEggImages } = useEasterEgg(computed(() => form.message));

const previewRef = ref<any>(null);
const backgroundRatio = ref<number | null>(null);

// 🎯 estilo ativo
const activeStyle = computed(
  () => cardStyles.find((s) => s.id === form.styleId) || cardStyles[0],
);

const shouldStackPreview = computed(
  () =>
    form.backgroundMode === 'image' &&
    !!form.backgroundImage &&
    !!backgroundRatio.value &&
    backgroundRatio.value > 1.35,
);

watch(
  () => form.backgroundImage,
  (src) => {
    if (!src || form.backgroundMode !== 'image') {
      backgroundRatio.value = null;
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (!img.naturalWidth || !img.naturalHeight) {
        backgroundRatio.value = null;
        return;
      }
      backgroundRatio.value = img.naturalWidth / img.naturalHeight;
    };
    img.onerror = () => {
      backgroundRatio.value = null;
    };
    img.src = src;
  },
  { immediate: true },
);

watch(availableImages, (images) => {
  if (form.backgroundMode !== 'image') return;

  const exists = images.some((img) => img.image === form.backgroundImage);
  if (exists) return;

  if (images.length > 0) {
    form.backgroundImage = images[0].image;
    return;
  }

  form.backgroundImage = '';
  form.backgroundMode = 'color';
});

// ----------------------
// 🛒 CARRINHO
// ----------------------
function increase(item: any) {
  addGift(item.gift);
}

function decrease(item: any) {
  if (item.quantity <= 1) {
    removeGift(item.gift.id);
  } else {
    removeGift(item.gift.id);
    addGift(item.gift);
  }
}

function remove(item: any) {
  removeGift(item.gift.id);
}

// ----------------------
// 💰 PIX
// ----------------------
const payload = ref('');
const qrCodeUrl = ref('');
const isGenerating = ref(false);
const errorMessage = ref('');
const copyFeedback = ref('');

async function buildPixCode() {
  isGenerating.value = true;
  errorMessage.value = '';

  try {
    const generatedPayload = await generatePixPayload({
      amount: cartTotal.value || undefined,
    });

    payload.value = generatedPayload;
    qrCodeUrl.value = await QRCode.toDataURL(generatedPayload);
  } catch {
    errorMessage.value = 'Erro ao gerar Pix.';
  } finally {
    isGenerating.value = false;
  }
}

async function copyPix() {
  if (!payload.value) return;

  await navigator.clipboard.writeText(payload.value);
  copyFeedback.value = 'Copiado!';
  setTimeout(() => (copyFeedback.value = ''), 1500);
}

watch(cartItems, buildPixCode, { immediate: true });

// ----------------------
// 📥 DOWNLOAD
// ----------------------
const isDownloading = ref(false);
const isModalOpen = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');

function showModal(title: string, message: string) {
  modalTitle.value = title;
  modalMessage.value = message;
  isModalOpen.value = true;
}

async function downloadCard() {
  if (!form.guestName.trim()) {
    showModal('Campo obrigatório', 'Informe seu nome.');
    return;
  }

  const el = previewRef.value?.getElement();
  if (!el) return;

  isDownloading.value = true;

  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: null,
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `cartao-${form.guestName}.png`;
    link.click();

    showModal('Pronto', 'Cartão gerado com sucesso!');
  } catch {
    showModal('Erro', 'Falha ao gerar imagem.');
  } finally {
    isDownloading.value = false;
  }
}
</script>

<template>
  <section class="page-container card-page">
    <header class="intro">
      <h1 class="page-title">Criação de Cartão</h1>
      <p class="page-subtitle">Personalize seu cartão 💛.</p>
    </header>

    <div class="grid" :class="{ 'grid--preview-top': shouldStackPreview }">
      <!-- 🖼️ PREVIEW -->
      <div class="preview-wrapper grid-panel-preview">
        <CardPreview
          ref="previewRef"
          :giftsNames="uniqueGiftNames"
          :guestName="form.guestName"
          :message="form.message"
          :selectedStyle="activeStyle"
          :backgroundColor="form.backgroundColor"
          :backgroundImage="form.backgroundImage"
          :backgroundMode="form.backgroundMode"
          :textColor="form.textColor"
          :fontFamily="form.fontFamily"
          :isBold="form.isBold"
          :isItalic="form.isItalic"
        />
      </div>

      <!-- 🧾 FORM -->
      <CardForm
        class="grid-panel-form"
        v-model:guestName="form.guestName"
        v-model:message="form.message"
        v-model:styleId="form.styleId"
        v-model:backgroundColor="form.backgroundColor"
        v-model:backgroundImage="form.backgroundImage"
        v-model:backgroundMode="form.backgroundMode"
        v-model:textColor="form.textColor"
        v-model:fontFamily="form.fontFamily"
        v-model:isBold="form.isBold"
        v-model:isItalic="form.isItalic"
        :styles="cardStyles"
        :available-images="availableImages"
        :is-downloading="isDownloading"
        @download="downloadCard"
      />

      <!-- 🛒 + 💰 -->
      <Card class="summary-card grid-panel-summary">
        <h3>Seu presente</h3>

        <div v-if="cartItems.length === 0" class="empty">
          Nenhum presente selecionado 😅
        </div>

        <ul v-else class="cart-list">
          <li v-for="item in cartItems" :key="item.gift.id" class="cart-item">
            <span class="item-name">{{ item.gift.name }}</span>

            <div class="qty-controls">
              <button @click="decrease(item)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="increase(item)">+</button>
            </div>

            <button class="remove-btn" @click="remove(item)">✕</button>
          </li>
        </ul>

        <div v-if="cartItems.length > 0" class="pix-block">
          <h4>Pagamento</h4>

          <textarea v-if="payload" :value="payload" readonly rows="3" />

          <div v-if="isGenerating">Gerando QR Code...</div>
          <p v-else-if="errorMessage">{{ errorMessage }}</p>

          <img v-else-if="qrCodeUrl" :src="qrCodeUrl" class="qr" />

          <Button @click="copyPix">Copiar código Pix</Button>
          <p v-if="copyFeedback">{{ copyFeedback }}</p>
        </div>
      </Card>
    </div>

    <Modal v-model="isModalOpen" :title="modalTitle">
      <p>{{ modalMessage }}</p>
    </Modal>
  </section>
</template>

<style scoped>
.card-page {
  display: grid;
  gap: 1.5rem;
}

.intro {
  display: grid;
  gap: 0.35rem;
}

.page-title {
  margin: 0;
  font-size: clamp(1.5rem, 2.8vw, 2rem);
}

.page-subtitle {
  margin: 0;
  opacity: 0.85;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-areas: 'preview form summary';
  gap: 1rem;
  align-items: start;
}

.grid > * {
  min-width: 0;
}

.grid-panel-preview {
  grid-area: preview;
}

.grid-panel-form {
  grid-area: form;
}

.grid-panel-summary {
  grid-area: summary;
}

.grid--preview-top {
  grid-template-columns: 1fr;
  grid-template-areas:
    'preview'
    'form'
    'summary';
}

.preview-wrapper {
  display: grid;
  gap: 0.75rem;
}

@media (min-width: 1151px) {
  .grid-panel-preview,
  .grid-panel-summary {
    position: sticky;
    top: calc(var(--header-height) + 12px);
  }

  .grid--preview-top .grid-panel-preview,
  .grid--preview-top .grid-panel-summary {
    position: static;
    top: auto;
  }
}

.summary-card {
  display: grid;
  gap: 0.9rem;
}

.summary-card h3,
.summary-card h4 {
  margin: 0;
}

.empty {
  margin: 0;
  opacity: 0.8;
}

.cart-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.65rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.5rem;
  align-items: center;
}

.item-name {
  font-size: 0.92rem;
}

.qty-controls {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.qty-controls button,
.remove-btn {
  border: 1px solid var(--color-surface-border);
  background: var(--color-surface);
  border-radius: 8px;
  cursor: pointer;
  height: 30px;
  min-width: 30px;
}

.pix-block {
  display: grid;
  gap: 0.6rem;
}

.pix-block textarea {
  width: 100%;
}

.qr {
  display: block;
  width: 180px;
  max-width: 100%;
  border-radius: 8px;
  margin: 0 auto;
}

@media (max-width: 1150px) {
  .grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      'preview'
      'form'
      'summary';
  }
}
</style>
