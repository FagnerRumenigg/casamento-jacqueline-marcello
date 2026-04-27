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
  let bg = props.backgroundColor;

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
    color: props.textColor,
    borderColor: props.selectedStyle?.border || '#ccc',
    fontFamily: props.fontFamily,
    fontWeight: props.isBold ? '700' : '400',
    fontStyle: props.isItalic ? 'italic' : 'normal',

    ...shapeStyles[props.selectedStyle?.shape || 'square'],
  };
});

// fallback
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
    <h2>Pré-visualização do Selo</h2>

    <div ref="previewEl" class="seal-preview" :style="dynamicStyle">
      <p class="seal-preview__kicker">Aproveite o(s)</p>

      <ul v-if="hasGifts" class="seal-gift-list">
        <li v-for="gift in uniqueGiftData" :key="gift?.id">
          {{ gift?.name }}
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
}

.seal-preview::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
}

.seal-preview * {
  position: relative;
  z-index: 1;
}

.seal-gift-list {
  list-style: none;
  padding: 0;
}
</style>
