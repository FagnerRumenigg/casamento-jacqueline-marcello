<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useUniqueCartGiftData } from '../../composables/useUniqueCartGiftData';
import type { CardStyle } from '../../types/card';
import Card from '../ui/Card.vue';

const props = defineProps<{
  guestName: string;
  message: string;
  giftsNames: string[];
  selectedStyle: CardStyle;
  backgroundColor: string;
  backgroundImage: string;
  backgroundMode: 'color' | 'image';
  textColor: string;
  textBackgroundColor: string;
  textBackgroundOpacity: number;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
}>();

const previewEl = ref<HTMLElement | null>(null);
const uniqueGiftData = useUniqueCartGiftData();
const imageRatio = ref<number | null>(null);

watch(
  () => props.backgroundImage,
  (src) => {
    if (!src || props.backgroundMode !== 'image') {
      imageRatio.value = null;
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!img.naturalWidth || !img.naturalHeight) {
        imageRatio.value = null;
        return;
      }

      imageRatio.value = img.naturalWidth / img.naturalHeight;
    };
    img.onerror = () => {
      imageRatio.value = null;
    };
    img.src = src;
  },
  { immediate: true },
);

function hexToRgba(hex: string): string {
  const normalized = hex.replace('#', '');
  const safeHex =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : normalized.padEnd(6, 'f').slice(0, 6);

  const red = Number.parseInt(safeHex.slice(0, 2), 16);
  const green = Number.parseInt(safeHex.slice(2, 4), 16);
  const blue = Number.parseInt(safeHex.slice(4, 6), 16);
  const alpha = Math.min(1, Math.max(0, props.textBackgroundOpacity));

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

const dynamicStyle = computed(() => {
  const shapeStyles: Record<string, Record<string, string>> = {
    square: { borderRadius: '16px' },
    rounded: { borderRadius: '24px' },
    pill: { borderRadius: '999px' },
    circle: { borderRadius: '50%', aspectRatio: '1 / 1' },
  };

  return {
    backgroundColor:
      props.backgroundMode === 'image'
        ? '#ffffff'
        : props.backgroundColor || '#ffffff',
    color: props.textColor || '#000000',
    borderColor: props.selectedStyle?.border || '#ccc',
    fontFamily: props.fontFamily,
    fontStyle: props.isItalic ? 'italic' : 'normal',
    fontWeight: props.isBold ? '700' : '400',
    '--card-font-weight': props.isBold ? '700' : '400',
    '--card-font-weight-strong': props.isBold ? '700' : '600',
    ...(props.backgroundMode === 'image' && imageRatio.value
      ? { aspectRatio: `${imageRatio.value} / 1`, minHeight: 'unset' }
      : {}),
    ...shapeStyles[props.selectedStyle?.shape || 'square'],
  };
});

const textPanelStyle = computed(() => {
  if (props.backgroundMode !== 'image' || !props.backgroundImage) {
    return {};
  }

  return {
    background: hexToRgba(props.textBackgroundColor || '#ffffff'),
  };
});

const guestLabel = computed(() => props.guestName.trim() || 'Seu nome aqui');
const messageLabel = computed(
  () => props.message.trim() || 'Sua mensagem especial aparecerá aqui.',
);
const hasGifts = computed(() => !!props.giftsNames?.length);
const hasBackgroundImage = computed(
  () => props.backgroundMode === 'image' && !!props.backgroundImage,
);

const previewShapeClass = computed(() => {
  const shape = props.selectedStyle?.shape || 'square';
  const hasImageClass = hasBackgroundImage.value ? 'card-preview--with-image' : '';

  return [`card-preview--${shape}`, hasImageClass];
});

function getElement(): HTMLElement | null {
  return previewEl.value;
}

defineExpose({ getElement });
</script>

<template>
  <Card class="card-preview-card">
    <h2>Pré-visualização</h2>

    <div
      ref="previewEl"
      class="card-preview"
      :class="previewShapeClass"
      :style="dynamicStyle"
    >
      <img
        v-if="hasBackgroundImage"
        :src="props.backgroundImage"
        alt=""
        class="card-preview__bg-image"
        crossorigin="anonymous"
      />

      <div
        class="card-preview__text-panel"
        :class="{ 'card-preview__text-panel--on-image': hasBackgroundImage }"
        :style="textPanelStyle"
      >
        <p class="card-preview__kicker">Experiência ativada</p>

        <ul v-if="hasGifts" class="card-gift-list">
          <li v-for="gift in uniqueGiftData" :key="gift.id">
            {{ gift.dynamicMessage }}
          </li>
        </ul>

        <h3 v-else>Nenhum presente selecionado</h3>

        <p v-if="hasGifts" class="card-preview__intro">
          Esse momento foi escolhido por:
        </p>

        <p class="card-preview__guest">{{ guestLabel }}</p>

        <div class="card-preview__message-block">
          <span class="card-preview__message-label">Recado especial:</span>
          <p class="card-preview__message">{{ messageLabel }}</p>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.card-preview-card {
  padding: var(--space-6);
}

.card-preview {
  position: relative;
  overflow: hidden;
  min-height: 290px;
  border: 2px solid;
  padding: var(--space-8);
  display: grid;
  align-content: center;
  text-align: center;
  gap: var(--space-3);
  background: #fff;
  color: #000;
}

.card-preview__bg-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 0;
}

.card-preview__text-panel {
  position: relative;
  z-index: 2;
  display: grid;
  gap: var(--space-3);
  width: min(100%, 560px);
  margin-inline: auto;
}

.card-preview__text-panel--on-image {
  padding: clamp(0.9rem, 2vw, 1.2rem);
  border-radius: 18px;
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.12);
}

.card-preview--pill,
.card-preview--circle {
  padding: var(--space-6);
}

.card-preview--pill .card-preview__text-panel,
.card-preview--circle .card-preview__text-panel,
.card-preview--pill .card-gift-list,
.card-preview--circle .card-gift-list,
.card-preview--pill .card-gift-list li,
.card-preview--circle .card-gift-list li,
.card-preview--pill .card-preview__message,
.card-preview--circle .card-preview__message,
.card-preview--pill .card-preview__intro,
.card-preview--circle .card-preview__intro,
.card-preview--pill .card-preview__message-label,
.card-preview--circle .card-preview__message-label,
.card-preview--pill .card-preview__guest,
.card-preview--circle .card-preview__guest {
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.card-preview--pill .card-preview__kicker,
.card-preview--circle .card-preview__kicker {
  font-size: 1.05rem;
}

.card-preview--circle {
  min-height: 320px;
}

.card-preview::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
  z-index: 1;
}

.card-preview--with-image::before {
  display: none;
}

.card-preview__kicker {
  font-size: 1.2rem;
  font-weight: var(--card-font-weight-strong);
}

.card-gift-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: var(--card-font-weight-strong);
}

.card-preview__intro {
  font-size: 0.9rem;
  font-weight: var(--card-font-weight-strong);
}

.card-preview__guest {
  font-size: 1.1rem;
  font-weight: var(--card-font-weight);
}

.card-preview__message-block {
  margin-top: 8px;
  display: grid;
  gap: 4px;
}

.card-preview__message-label {
  font-size: 0.85rem;
  font-weight: var(--card-font-weight-strong);
}

.card-preview__message {
  font-size: 0.95rem;
  font-weight: var(--card-font-weight);
}

@media (max-width: 640px) {
  .card-preview {
    padding: var(--space-6);
    align-content: start;
  }

  .card-preview--with-image {
    aspect-ratio: auto !important;
    min-height: 420px;
  }

  .card-preview__text-panel {
    width: 100%;
  }
}
</style>
