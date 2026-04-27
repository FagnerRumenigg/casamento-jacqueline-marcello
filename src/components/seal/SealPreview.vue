<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUniqueCartGiftData } from '../../composables/useUniqueCartGiftData';

import type { Gift } from '../../types/gift';
import type { SealStyle } from '../../types/seal';
import Card from '../ui/Card.vue';

const props = defineProps<{
  guestName: string;
  message: string;
  giftsNames: string[];
  selectedStyle: SealStyle;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
}>();

const previewEl = ref<HTMLElement | null>(null);

const uniqueGiftData = useUniqueCartGiftData();

const dynamicStyle = computed(() => {
  let bg = props.backgroundColor || props.selectedStyle.background;
  // Suporte a degradê e imagem
  if (
    props.selectedStyle.background &&
    props.selectedStyle.background.startsWith('linear-gradient')
  ) {
    bg = props.selectedStyle.background;
  }
  if (
    props.selectedStyle.background &&
    props.selectedStyle.background.startsWith('url(')
  ) {
    bg = props.selectedStyle.background;
  }
  return {
    background: bg,
    color: props.textColor,
    borderColor: props.selectedStyle.border,
    fontFamily: props.fontFamily,
    fontWeight: props.isBold ? '700' : '400',
    fontStyle: props.isItalic ? 'italic' : 'normal',
  };
});

const guestLabel = computed(() => props.guestName.trim() || 'Seu nome aqui');
const messageLabel = computed(
  () => props.message.trim() || 'Sua mensagem especial aparecera aqui.',
);
const hasGifts = computed(() => props.giftsNames.length > 0);
const giftsLabel = computed(() => {
  if (!props.giftsNames.length) return 'Nenhum presente selecionado';
  if (props.giftsNames.length === 1) return props.giftsNames[0];
  return props.giftsNames.join(', ');
});

function getElement(): HTMLElement | null {
  return previewEl.value;
}

defineExpose({ getElement });
</script>

<template>
  <Card class="seal-preview-card">
    <h2>Pre Visualização do Selo</h2>

    <div ref="previewEl" class="seal-preview" :style="dynamicStyle">
      <p class="seal-preview__kicker">Aproveite o(s)</p>
      <ul v-if="hasGifts" class="seal-gift-list seal-gift-list-center">
        <li v-for="gift in uniqueGiftData" :key="gift?.id">
          <span
            :style="{
              color: props.textColor,
              fontFamily: props.fontFamily,
              fontWeight: props.isBold ? '700' : '400',
              fontStyle: props.isItalic ? 'italic' : 'normal',
            }"
          >
            {{ gift?.name }}
          </span>
        </li>
      </ul>
      <h3 v-else>Nenhum presente selecionado</h3>
      <p class="seal-preview__guest">{{ guestLabel }}</p>
      <p class="seal-preview__message">{{ messageLabel }}</p>
    </div>
  </Card>
</template>

<style scoped>
.seal-preview-card {
  padding: var(--space-6);
}

.seal-preview-card h2 {
  margin: 0 0 var(--space-4);
  font-family: var(--font-display);
  color: var(--color-primary);
}

.seal-preview {
  min-height: 290px;
  border: 2px solid;
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  display: grid;
  align-content: center;
  text-align: center;
  gap: var(--space-3);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15);
}

.seal-preview__kicker {
  margin: 0;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.seal-preview h3 {
  margin: 0;
  font-size: clamp(1.4rem, 3.8vw, 2rem);
  font-family: var(--font-display);
}

.seal-preview__guest {
  margin: 0;
  font-size: 1.05rem;
}

.seal-preview__message {
  margin: 0;
  opacity: 0.88;
}
.seal-gift-list {
  list-style: disc inside;
  margin: 0 0 var(--space-2) 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2em;
}
.seal-gift-list-center {
  justify-content: center;
  align-items: center;
}
.seal-gift-list li {
  color: var(--color-primary);
  font-size: 1.08rem;
  font-family: var(--font-display);
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.seal-gift-img {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 0.3em;
  border: 1px solid var(--color-surface-border);
}
</style>
