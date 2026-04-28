<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUniqueCartGiftData } from '../../composables/useUniqueCartGiftData';
import type { SealStyle } from '../../types/seal';
import Card from '../ui/Card.vue';

const props = defineProps<{
  guestName: string;
  message: string;
  giftsNames: string[];
  selectedStyle: SealStyle;
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

// 🎨 estilo dinâmico
const dynamicStyle = computed(() => {
  let bg = props.backgroundColor || '#ffffff';

  if (props.backgroundMode === 'image' && props.backgroundImage) {
    bg = `url('${props.backgroundImage}') center/cover no-repeat`;
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
    ...shapeStyles[props.selectedStyle?.shape || 'square'],
  };
});

const guestLabel = computed(() => props.guestName.trim() || 'Seu nome aqui');
const messageLabel = computed(
  () => props.message.trim() || 'Sua mensagem especial aparecerá aqui.',
);
const hasGifts = computed(() => !!props.giftsNames?.length);

function getElement(): HTMLElement | null {
  return previewEl.value;
}

defineExpose({ getElement });
</script>

<template>
  <Card class="seal-preview-card">
    <h2>Pré-visualização</h2>

    <div ref="previewEl" class="seal-preview" :style="dynamicStyle">
      <!-- 🥚 botão -->
      <div class="easter-egg">Qui AMA?!</div>

      <!-- 🖼️ overlay FULL -->
      <img
        src="https://i.ytimg.com/vi/saPu_bwTjK4/hqdefault.jpg"
        alt="meme"
        class="easter-egg-overlay"
      />

      <!-- TÍTULO -->
      <p class="seal-preview__kicker">🎉 Experiência Ativada</p>

      <!-- PRESENTES -->
      <ul v-if="hasGifts" class="seal-gift-list">
        <li v-for="gift in uniqueGiftData" :key="gift?.id">
          {{ gift?.dynamicMessage }}
        </li>
      </ul>

      <h3 v-else>Nenhum presente selecionado</h3>

      <!-- FRASE -->
      <p v-if="hasGifts" class="seal-preview__intro">
        Esse momento foi escolhido por:
      </p>

      <!-- NOME -->
      <p class="seal-preview__guest">{{ guestLabel }}</p>

      <!-- MENSAGEM -->
      <div class="seal-preview__message-block">
        <span class="seal-preview__message-label">💌 Recado especial:</span>
        <p class="seal-preview__message">{{ messageLabel }}</p>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.seal-preview-card {
  padding: var(--space-6);
}

.seal-preview {
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

.seal-preview::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.05);
  z-index: 1;
}

.seal-preview * {
  position: relative;
  z-index: 2;
}

/* 🥚 botão */
.easter-egg {
  position: absolute;
  top: 10px;
  right: 14px;
  font-size: 0.75rem;
  opacity: 0.6;
  cursor: pointer;
  z-index: 10;
}

/* 🖼️ overlay */
.easter-egg-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 5;
  pointer-events: none;
  filter: brightness(0.9) contrast(1.1);
}

.easter-egg:hover ~ .easter-egg-overlay {
  opacity: 1;
}

/* 🔥 Tipografia */

.seal-preview__kicker {
  font-size: 1.2rem;
  font-weight: 700;
}

/* ✨ NOVO */
.seal-preview__dynamic {
  font-size: 0.95rem;
  font-weight: 700;
  opacity: 0.9;
}

.seal-gift-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: 700;
}

.seal-preview__intro {
  font-size: 0.9rem;
  font-weight: 700;
}

.seal-preview__guest {
  font-size: 1.1rem;
  font-weight: 400;
}

.seal-preview__message-block {
  margin-top: 8px;
  display: grid;
  gap: 4px;
}

.seal-preview__message-label {
  font-size: 0.85rem;
  font-weight: 700;
}

.seal-preview__message {
  font-size: 0.95rem;
  font-weight: 400;
}
</style>
