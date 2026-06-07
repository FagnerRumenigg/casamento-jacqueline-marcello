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
    const selectedIndex = items.findIndex(
      (item) => item.image === selectedImage,
    );
    if (selectedIndex >= 0) {
      index.value = selectedIndex;
    }
  },
  { immediate: true, deep: true },
);

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

const helperMessage = computed(() => {
  if (!props.items.length) {
    return 'Escolha um presente para liberar backgrounds.';
  }

  return 'Escolha uma imagem para o cartão.';
});
</script>

<template>
  <div class="carousel">
    <p class="helper">{{ helperMessage }}</p>

    <div v-if="items.length" class="carousel__content">
      <button type="button" class="arrow" @click="prev" aria-label="Imagem anterior">
        ‹
      </button>

      <div class="preview" @click="select">
        <img :src="current.image" :alt="current.label" />

        <span v-if="current.type === 'easter'" class="badge">secreto</span>
      </div>

      <button type="button" class="arrow" @click="next" aria-label="Próxima imagem">
        ›
      </button>
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
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}

.preview {
  flex-shrink: 0;
  width: 240px;
  height: 240px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: transform 0.15s ease;
}

@media (max-width: 480px) {
  .preview {
    width: 200px;
    height: 200px;
  }
}

.preview:hover {
  transform: scale(1.02);
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
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
  flex-shrink: 0;
  font-size: 1.8rem;
  cursor: pointer;
  background: #000000;
  border: 1px solid #000000;
  color: #ffffff;
  border-radius: 999px;
  transition: transform 0.15s;
  padding: 8px 12px;
}

.arrow:hover {
  transform: scale(1.2);
}
</style>
