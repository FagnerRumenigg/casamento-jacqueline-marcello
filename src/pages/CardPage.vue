<script setup lang="ts">
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { computed, reactive, ref, watch } from 'vue';

import CardForm from '../components/card/CardForm.vue';
import CardPreview from '../components/card/CardPreview.vue';
import PageHero from '../components/layout/PageHero.vue';
import Modal from '../components/ui/Modal.vue';
import Card from '../components/ui/Card.vue';
import Button from '../components/ui/Button.vue';
import { useEasterEgg } from '../composables/useEasterEgg';
import { useUniqueCartGiftNames } from '../composables/useUniqueCartGiftNames';
import { useGiftCart } from '../stores/giftCart';
import type { CardFormState, CardStyle } from '../types/card';
import { uploadCardToCloudinary } from '../utils/cloudinary';
import { generatePixPayload } from '../utils/pix';

const giftCart = useGiftCart();
const { cartItems, cartTotal, addGift, decreaseGift, removeGift } = giftCart;
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const uniqueGiftNames = useUniqueCartGiftNames();

const giftImages = computed(() =>
  cartItems.value
    .filter((item) => !!item.gift.imageUrl)
    .map((item) => ({
      label: item.gift.name,
      image: item.gift.imageUrl,
      type: 'gift' as const,
    })),
);

const form = reactive<CardFormState>({
  guestName: '',
  message: '',
  styleId: 'classic',
  backgroundColor: '#ffffff',
  backgroundImage: '',
  backgroundMode: 'color',
  textColor: '#000000',
  textBackgroundColor: '#ffffff',
  textBackgroundOpacity: 0.5,
  fontFamily: "'Noto Serif', serif",
  isBold: false,
  isItalic: false,
});

const { easterEggImages } = useEasterEgg(computed(() => form.message));
const cardDescription = `Agora você pode personalizar o seu cartão! 🖤

Mas atenção: escondemos alguns easter eggs para os cronicamente online, como o noivo.
Você conhece algum meme famoso? Experimente escrever uma frase icônica na sua mensagem para os noivos.

Por exemplo:
Não sou capaz de opinar.
É verdade esse bilete.

Quem sabe você não desbloqueia um cartão surpresa? 😉`;

const previewDescription = `É aqui que a mágica acontece. ✨

Tudo o que você alterar aparecerá neste cartão em tempo real.

Confira se a mensagem está do jeito que você imaginou, se não esqueceu nenhuma letra e se o meme está no ponto.

Afinal, uma obra-prima merece revisão antes de ir para a galeria dos noivos. 🖤😉`;

const paymentDescription = `Os presentes já estão separados. ✅

Agora é hora de oficializar sua contribuição com o QR Code abaixo.

Assim que terminar, você seguirá para a etapa de personalização do cartão, onde a criatividade (e alguns memes) são muito bem-vindos. 😌 `;

const easterImages = computed(() =>
  easterEggImages.value.map((image, index) => ({
    label: `Secreto ${index + 1}`,
    image,
    type: 'easter' as const,
  })),
);

const availableImages = computed(() => [...giftImages.value, ...easterImages.value]);

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

const previewRef = ref<{ getElement: () => HTMLElement | null } | null>(null);
const backgroundRatio = ref<number | null>(null);
const payload = ref('');
const qrCodeUrl = ref('');
const isGenerating = ref(false);
const errorMessage = ref('');
const copyFeedback = ref('');
const isDownloading = ref(false);
const isModalOpen = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');

const activeStyle = computed(
  () => cardStyles.find((style) => style.id === form.styleId) || cardStyles[0],
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
    img.crossOrigin = 'anonymous';
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

  const exists = images.some((image) => image.image === form.backgroundImage);
  if (exists) return;

  if (images.length > 0) {
    form.backgroundImage = images[0].image;
    return;
  }

  form.backgroundImage = '';
  form.backgroundMode = 'color';
});

watch(cartItems, buildPixCode, { immediate: true });

function showModal(title: string, message: string) {
  modalTitle.value = title;
  modalMessage.value = message;
  isModalOpen.value = true;
}

function slugifyFileName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Não foi possível converter o cartão em imagem.'));
        return;
      }

      resolve(blob);
    }, 'image/png');
  });
}

function downloadBlob(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = objectUrl;
  link.download = fileName;
  link.click();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
}

function buildMessagePreview(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  return trimmed.length > 140 ? `${trimmed.slice(0, 137)}...` : trimmed;
}

function increase(item: (typeof cartItems.value)[number]) {
  addGift(item.gift);
}

function decrease(item: (typeof cartItems.value)[number]) {
  decreaseGift(item.gift.id);
}

function remove(item: (typeof cartItems.value)[number]) {
  removeGift(item.gift.id);
}

async function buildPixCode() {
  isGenerating.value = true;
  errorMessage.value = '';

  try {
    const generatedPayload = await generatePixPayload({
      amount: cartTotal.value || undefined,
    });

    payload.value = generatedPayload.trim();
    qrCodeUrl.value = await QRCode.toDataURL(payload.value);
  } catch {
    errorMessage.value = 'Erro ao gerar Pix.';
  } finally {
    isGenerating.value = false;
  }
}

async function copyPix() {
  if (!payload.value) return;

  await navigator.clipboard.writeText(payload.value.trim());
  copyFeedback.value = 'Código Pix copiado!';
  window.setTimeout(() => {
    copyFeedback.value = '';
  }, 1500);
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
    const safeGuestName = slugifyFileName(form.guestName) || 'convidado';
    const fileName = `cartao-${safeGuestName}.png`;
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
      allowTaint: false,
    });
    const blob = await canvasToBlob(canvas);
    await uploadCardToCloudinary(blob, fileName, {
      guestName: form.guestName,
      messagePreview: buildMessagePreview(form.message),
    });

    downloadBlob(blob, fileName);

    showModal(
      'Pronto',
      'Seu cartão foi baixado para você ter uma cópia sua e guardar para sempre e também foi enviado para os noivos lerem seus sentimentos. ❤',
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Falha ao gerar imagem.';
    showModal('Erro', message);
  } finally {
    isDownloading.value = false;
  }
}
</script>

<template>
  <section class="page-container card-page">
    <PageHero title="Criação de Cartão" />

    <div class="grid" :class="{ 'grid--preview-top': shouldStackPreview }">
      <Card class="summary-card grid-panel-summary">
        <h3>Seu presente</h3>

        <div v-if="cartItems.length === 0" class="empty">
          Nenhum presente selecionado.
        </div>

        <ul v-else class="cart-list">
          <li v-for="item in cartItems" :key="item.gift.id" class="cart-item">
            <div class="item-info">
              <span class="item-name">{{ item.gift.name }}</span>
              <strong class="item-subtotal">
                {{ currencyFormatter.format(item.gift.price * item.quantity) }}
              </strong>
            </div>

            <div class="qty-controls">
              <button @click="decrease(item)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="increase(item)">+</button>
            </div>

            <button class="remove-btn" @click="remove(item)">x</button>
          </li>
        </ul>

        <div v-if="cartItems.length > 0" class="pix-block">
          <p class="card-description card-description--payment">
            {{ paymentDescription }}
          </p>

          <h4>Pagamentos</h4>
          <p class="pix-total">Total: {{ currencyFormatter.format(cartTotal) }}</p>

          <div v-if="isGenerating">Gerando QR Code...</div>
          <p v-else-if="errorMessage">{{ errorMessage }}</p>
          <template v-else-if="qrCodeUrl">
            <textarea :value="payload" readonly rows="4" class="pix-code" />
            <Button @click="copyPix">Copiar código Pix</Button>
            <img :src="qrCodeUrl" class="qr" />
            <p v-if="copyFeedback" class="copy-feedback">{{ copyFeedback }}</p>
          </template>
        </div>
      </Card>

      <div class="form-stack grid-panel-form">
        <CardForm
          v-model:guestName="form.guestName"
          v-model:message="form.message"
          v-model:styleId="form.styleId"
          v-model:backgroundColor="form.backgroundColor"
          v-model:backgroundImage="form.backgroundImage"
          v-model:backgroundMode="form.backgroundMode"
          v-model:textColor="form.textColor"
          v-model:textBackgroundColor="form.textBackgroundColor"
          v-model:textBackgroundOpacity="form.textBackgroundOpacity"
          v-model:fontFamily="form.fontFamily"
          v-model:isBold="form.isBold"
          v-model:isItalic="form.isItalic"
          :styles="cardStyles"
          :available-images="availableImages"
          :is-downloading="isDownloading"
          @download="downloadCard"
        >
          <template #intro>
            <p class="card-description card-description--form">
              {{ cardDescription }}
            </p>
          </template>
        </CardForm>
      </div>

      <Card class="preview-wrapper grid-panel-preview">
        <p class="card-description card-description--preview">
          {{ previewDescription }}
        </p>
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
          :textBackgroundColor="form.textBackgroundColor"
          :textBackgroundOpacity="form.textBackgroundOpacity"
          :fontFamily="form.fontFamily"
          :isBold="form.isBold"
          :isItalic="form.isItalic"
        />
      </Card>
    </div>

    <Modal v-model="isModalOpen" :title="modalTitle">
      <p style="white-space: pre-line">{{ modalMessage }}</p>
    </Modal>
  </section>
</template>

<style scoped>
.card-page {
  display: grid;
  gap: 1.5rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-areas: 'summary form preview';
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
    'summary'
    'form'
    'preview';
}

.form-stack {
  display: grid;
  gap: 1rem;
}

.card-description {
  margin: 0;
  color: var(--color-text-muted);
  white-space: pre-line;
}

.card-description--payment,
.card-description--form,
.card-description--preview {
  padding: 0.2rem 0 0.35rem;
}

.card-description--preview {
  text-align: center;
}

.preview-wrapper {
  display: grid;
  gap: 0.75rem;
}

@media (min-width: 1151px) {
  .grid-panel-summary,
  .grid-panel-preview {
    position: sticky;
    top: calc(var(--header-height) + 12px);
  }

  .grid--preview-top .grid-panel-summary,
  .grid--preview-top .grid-panel-preview {
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

.item-info {
  display: grid;
  gap: 0.2rem;
}

.item-name {
  font-size: 0.92rem;
}

.item-subtotal {
  color: var(--color-primary);
  font-family: var(--font-display);
  font-size: 1rem;
}

.qty-controls {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.qty-controls button,
.remove-btn {
  border: 1px solid #000000;
  background: #000000;
  color: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  height: 30px;
  min-width: 30px;
}

.pix-block {
  display: grid;
  gap: 0.75rem;
}

.pix-total {
  margin: 0;
  color: var(--color-primary);
  font-family: var(--font-display);
  font-size: 1.2rem;
}

.qr {
  display: block;
  width: 180px;
  max-width: 100%;
  border-radius: 8px;
  margin: 0 auto;
}

.pix-code {
  width: 100%;
  border: 1px solid var(--color-surface-border);
  border-radius: 10px;
  background: var(--color-surface);
  padding: 0.75rem;
  resize: none;
  color: var(--color-text);
  font: inherit;
}

.copy-feedback {
  margin: 0;
  color: var(--color-text-muted);
  text-align: center;
}

@media (max-width: 1150px) {
  .grid,
  .grid--preview-top {
    grid-template-columns: 1fr;
    grid-template-areas:
      'summary'
      'form'
      'preview';
  }
}
</style>
