<script setup lang="ts">
import { computed, ref, watch } from 'vue';

export interface BackgroundOption {
  label: string;
  image: string;
  type: 'gift' | 'easter';
}

const props = defineProps<{
  items: BackgroundOption[];
  selectedImage?: string;
}>();

const emit = defineEmits<{
  select: [image: string];
}>();

const index = ref(0);

const current = computed(() => props.items[index.value]);

watch(
  () => props.items.length,
  () => {
    index.value = 0;
  },
);

watch(
  () => [props.selectedImage, props.items] as const,
  ([selectedImage, items]) => {
    if (!selectedImage || !items.length) return;
    const selectedIndex = items.findIndex((item) => item.image === selectedImage);
    if (selectedIndex >= 0) {
      index.value = selectedIndex;
    }
  },
  { immediate: true, deep: true },
);

// navegação
function next() {
  if (!props.items.length) return;
  index.value = (index.value + 1) % props.items.length;
}

function prev() {
  if (!props.items.length) return;
  index.value = (index.value - 1 + props.items.length) % props.items.length;
}

function select() {
  if (!current.value) return;
  emit('select', current.value.image);
}

// 🧠 mensagens dinâmicas
const helperMessage = computed(() => {
  if (!props.items.length) {
    return '🎁 Escolha um presente para liberar backgrounds';
  }

  return '🎨 Escolha uma imagem para o cartão';
});
</script>

<template>
  <div class="carousel">
    <p class="helper">{{ helperMessage }}</p>

    <div v-if="items.length" class="carousel__content">
      <button type="button" class="arrow" @click="prev">←</button>

      <div class="preview" @click="select">
        <img :src="current.image" />

        <span v-if="current.type !== 'easter'" class="label">
          {{ current.label }}
        </span>

        <!-- badge secreto -->
        <span v-if="current.type === 'easter'" class="badge"> secreto </span>
      </div>

      <button type="button" class="arrow" @click="next">→</button>
    </div>
  </div>
</template>

<style scoped>
.carousel {
  display: grid;
  gap: 8px;
  justify-items: center;
}

.helper {
  font-size: 0.85rem;
  opacity: 0.7;
  text-align: center;
}

.carousel__content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview {
  width: 240px;
  height: 240px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: transform 0.15s ease;
}

.preview:hover {
  transform: scale(1.02);
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.label {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
}

.badge {
  position: absolute;
  top: 6px;
  left: 6px;
  font-size: 0.7rem;
  background: gold;
  color: black;
  padding: 2px 6px;
  border-radius: 6px;
  font-weight: 600;
}

.arrow {
  font-size: 1.8rem;
  cursor: pointer;
  background: none;
  border: none;
  color: var(--color-primary);
  transition: transform 0.15s;
}

.arrow:hover {
  transform: scale(1.2);
}
</style>
