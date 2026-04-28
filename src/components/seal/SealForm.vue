<script setup lang="ts">
import { computed, ref } from 'vue';
import type { SealStyle } from '../../types/seal';
import Card from '../ui/Card.vue';
import Input from '../ui/Input.vue';
import Select from '../ui/Select.vue';
import Textarea from '../ui/Textarea.vue';
import { gifts } from '../../data/gifts';

// MODELS
const guestName = defineModel<string>('guestName', { default: '' });
const message = defineModel<string>('message', { default: '' });
const styleId = defineModel<string>('styleId', { default: '' });

const backgroundColor = defineModel<string>('backgroundColor', {
  default: '#fff6d9',
});
const backgroundImage = defineModel<string>('backgroundImage', {
  default: '',
});
const backgroundMode = defineModel<'color' | 'image'>('backgroundMode', {
  default: 'color',
});

const textColor = defineModel<string>('textColor', { default: '#2f2500' });
const fontFamily = defineModel<string>('fontFamily', {
  default: "'Noto Serif', serif",
});
const isBold = defineModel<boolean>('isBold', { default: false });
const isItalic = defineModel<boolean>('isItalic', { default: false });

const props = defineProps<{
  styles: SealStyle[];
  isDownloading: boolean;
}>();

const emit = defineEmits<{
  download: [];
}>();

// 🎯 opções de estilo
const styleOptions = computed(() =>
  props.styles.map((style) => ({
    label: style.label,
    value: style.id,
  })),
);

// 🖼️ controle de imagem
const currentImageIndex = ref(0);

const currentGift = computed(() => gifts[currentImageIndex.value]);

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % gifts.length;
}

function prevImage() {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + gifts.length) % gifts.length;
}

function selectCurrentImage() {
  backgroundImage.value = currentGift.value.imageUrl;
}

// 🎨 helper cor
// Removido: normalizeHex não utilizado

// 🚀 download
function handleDownload(): void {
  emit('download');
}
</script>

<template>
  <Card>
    <form class="form seal-form" @submit.prevent="handleDownload">
      <h2 class="seal-form-title">Personalize seu selo</h2>

      <div class="field">
        <Input
          id="seal-guestName"
          v-model="guestName"
          label="Nome"
          placeholder="Digite seu nome"
          :required="true"
        />
      </div>

      <div class="field">
        <Textarea
          id="seal-message"
          v-model="message"
          label="Mensagem"
          placeholder="Escreva uma mensagem"
          :rows="4"
        />
      </div>

      <div class="field">
        <Select
          id="seal-styleId"
          v-model="styleId"
          label="Formato do selo"
          :options="styleOptions"
        />
      </div>

      <!-- 🎨 modo fundo -->
      <div class="field background-mode-row">
        <label>
          <input type="radio" v-model="backgroundMode" value="color" />
          Cor
        </label>
        <label>
          <input type="radio" v-model="backgroundMode" value="image" />
          Imagem
        </label>
      </div>

      <!-- 🎨 cor fundo -->
      <div v-if="backgroundMode === 'color'" class="field">
        <label class="section-label">Cor de fundo</label>
        <div class="color-field">
          <input type="color" v-model="backgroundColor" class="color-picker" />
          <input type="text" v-model="backgroundColor" class="color-input" />
        </div>
      </div>

      <!-- 🖼️ imagem -->
      <div v-if="backgroundMode === 'image'" class="field">
        <label class="section-label">Imagem</label>

        <div class="image-selector">
          <button type="button" class="arrow" @click="prevImage">←</button>

          <div class="image-preview" @click="selectCurrentImage">
            <img :src="currentGift.imageUrl" />
            <span class="image-name">{{ currentGift.name }}</span>
          </div>

          <button type="button" class="arrow" @click="nextImage">→</button>
        </div>
      </div>

      <!-- 🎨 cor texto -->
      <div class="field">
        <label class="section-label">Cor do texto</label>
        <div class="color-field">
          <input type="color" v-model="textColor" class="color-picker" />
          <input type="text" v-model="textColor" class="color-input" />
        </div>
      </div>

      <!-- ✍️ tipografia -->
      <div class="field typography-section">
        <Select
          id="seal-fontFamily"
          v-model="fontFamily"
          label="Fonte"
          :options="[
            { label: 'Noto Serif', value: `'Noto Serif', serif` },
            { label: 'Be Vietnam Pro', value: `'Be Vietnam Pro', sans-serif` },
          ]"
        />

        <div class="font-style-row">
          <label>
            <input type="checkbox" v-model="isBold" />
            Negrito
          </label>
          <label>
            <input type="checkbox" v-model="isItalic" />
            Itálico
          </label>
        </div>
      </div>

      <button class="download-btn" :disabled="props.isDownloading">
        {{ props.isDownloading ? 'Gerando...' : 'Baixar selo' }}
      </button>
    </form>
  </Card>
</template>

<style scoped>
.seal-form {
  max-width: 420px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  border-radius: 18px;
}

.field {
  margin-bottom: 1.2rem;
}

.background-mode-row {
  display: flex;
  gap: 2rem;
}

.color-field {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-picker {
  width: 42px;
  height: 42px;
  border: none;
  cursor: pointer;
}

.color-input {
  flex: 1;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.image-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.image-preview {
  width: 180px;
  height: 180px;
  cursor: pointer;
  overflow: hidden;
  border-radius: 10px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.arrow {
  font-size: 1.5rem;
  cursor: pointer;
}

.download-btn {
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.8rem;
}
</style>
