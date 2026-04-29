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

// 🎨 estilo dinâmico (AGORA BURRO E FELIZ)
const dynamicStyle = computed(() => {
  let bg = props.backgroundColor || '#ffffff';

  if (props.backgroundMode === 'image' && props.backgroundImage) {
    bg = `url('${props.backgroundImage}') center/contain no-repeat`;
  }

  const shapeStyles: Record<string, any> = {
    square: { borderRadius: '16px' },
    rounded: { borderRadius: '24px' },
    pill: { borderRadius: '999px' },
    circle: { borderRadius: '50%', aspectRatio: '1 / 1' },
  };

  return {
    background: bg,
    color: props.textColor || '#000000',
    borderColor: props.selectedStyle?.border || '#ccc',
    fontFamily: props.fontFamily,
    fontStyle: props.isItalic ? 'italic' : 'normal',
    fontWeight: props.isBold ? '700' : '400',
    ...(props.backgroundMode === 'image' && imageRatio.value
      ? { aspectRatio: `${imageRatio.value} / 1`, minHeight: 'unset' }
      : {}),
    ...shapeStyles[props.selectedStyle?.shape || 'square'],
  };
});

const guestLabel = computed(() => props.guestName.trim() || 'Seu nome aqui');

const messageLabel = computed(
  () => props.message.trim() || 'Sua mensagem especial aparecerá aqui.',
);

const hasGifts = computed(() => !!props.giftsNames?.length);
const previewShapeClass = computed(() => {
  const shape = props.selectedStyle?.shape || 'square';
  const hasImageClass =
    props.backgroundMode === 'image' && props.backgroundImage
      ? 'card-preview--with-image'
      : '';
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
      <!-- TÍTULO -->
      <p class="card-preview__kicker">🎉 Experiência Ativada</p>

      <!-- PRESENTES -->
      <ul v-if="hasGifts" class="card-gift-list">
        <li v-for="gift in uniqueGiftData" :key="gift?.id">
          {{ gift?.dynamicMessage }}
        </li>
      </ul>

      <h3 v-else>Nenhum presente selecionado</h3>

      <!-- FRASE -->
      <p v-if="hasGifts" class="card-preview__intro">
        Esse momento foi escolhido por:
      </p>

      <!-- NOME -->
      <p class="card-preview__guest">{{ guestLabel }}</p>

      <!-- MENSAGEM -->
      <div class="card-preview__message-block">
        <span class="card-preview__message-label"> 💌 Recado especial: </span>
        <p class="card-preview__message">{{ messageLabel }}</p>
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

.card-preview--pill,
.card-preview--circle {
  padding: var(--space-6);
}

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

/* overlay pra legibilidade */
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

/* garante conteúdo acima */
.card-preview * {
  position: relative;
  z-index: 2;
}

/* tipografia */
.card-preview__kicker {
  font-size: 1.2rem;
  font-weight: 700;
}

.card-gift-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: 700;
}

.card-preview__intro {
  font-size: 0.9rem;
  font-weight: 600;
}

.card-preview__guest {
  font-size: 1.1rem;
}

.card-preview__message-block {
  margin-top: 8px;
  display: grid;
  gap: 4px;
}

.card-preview__message-label {
  font-size: 0.85rem;
  font-weight: 600;
}

.card-preview__message {
  font-size: 0.95rem;
}
</style>
