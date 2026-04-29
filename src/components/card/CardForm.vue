<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import type { CardStyle } from '../../types/card';
import Card from '../ui/Card.vue';
import Input from '../ui/Input.vue';
import Modal from '../ui/Modal.vue';
import Select from '../ui/Select.vue';
import Textarea from '../ui/Textarea.vue';
import ImageCarousel from './ImageCarousel.vue';

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
const isHelpOpen = ref(false);
const imageFieldRef = ref<HTMLElement | null>(null);
const showUnlockNotice = ref(false);
const previousEasterImages = ref<string[]>([]);

const props = defineProps<{
  styles: CardStyle[];
  isDownloading: boolean;

  // 🔥 imagens vindas do pai
  availableImages: {
    label: string;
    image: string;
    type: 'gift' | 'easter';
  }[];
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
const easterCount = computed(
  () => props.availableImages.filter((img) => img.type === 'easter').length,
);
const hasEaster = computed(() => easterCount.value > 0);
const easterImages = computed(() =>
  props.availableImages
    .filter((img) => img.type === 'easter')
    .map((img) => img.image),
);

watch(easterCount, async (newCount, oldCount) => {
  if (newCount <= oldCount) return;

  const newlyUnlocked = easterImages.value.filter(
    (image) => !previousEasterImages.value.includes(image),
  );
  const latestUnlockedImage = newlyUnlocked[newlyUnlocked.length - 1];

  if (latestUnlockedImage) {
    backgroundMode.value = 'image';
    backgroundImage.value = latestUnlockedImage;
  }

  showUnlockNotice.value = true;
  await nextTick();
  imageFieldRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => {
    showUnlockNotice.value = false;
  }, 2800);
});

watch(
  easterImages,
  (images) => {
    previousEasterImages.value = [...images];
  },
  { immediate: true },
);

// 🎯 seleção de imagem
function handleSelectImage(image: string) {
  backgroundMode.value = 'image';
  backgroundImage.value = image;
}

// 🚀 download
function handleDownload(): void {
  emit('download');
}
</script>

<template>
  <Card>
    <form class="form card-form" @submit.prevent="handleDownload">
      <h2 class="card-form-title">Personalize seu cartão</h2>
      <button
        type="button"
        class="secret-help-btn"
        @click="isHelpOpen = true"
        aria-label="Dicas secretas"
      >
        Dicas secretas
      </button>

      <!-- NOME -->
      <div class="field">
        <Input
          v-model="guestName"
          label="Nome"
          placeholder="Digite seu nome"
          :required="true"
        />
      </div>

      <!-- MENSAGEM -->
      <div class="field">
        <Textarea
          v-model="message"
          label="Mensagem"
          placeholder="Escreva uma mensagem"
          :rows="4"
        />
      </div>

      <!-- ESTILO -->
      <div v-if="backgroundMode === 'color'" class="field">
        <Select
          v-model="styleId"
          label="Formato do cartão"
          :options="styleOptions"
        />
      </div>

      <!-- 🎨 modo fundo -->
      <div class="field background-mode-field">
        <label class="section-label">Fundo do cartão</label>
        <div class="background-mode-row">
          <label>
            <input type="radio" v-model="backgroundMode" value="color" />
            Cor sólida
          </label>
          <label>
            <input type="radio" v-model="backgroundMode" value="image" />
            Foto de fundo
          </label>
        </div>
        <p v-if="backgroundMode === 'color'" class="mode-hint">
          Escolha uma cor simples para montar seu cartão.
        </p>
        <p v-else class="mode-hint">
          Escolha uma imagem dos presentes. Frases na mensagem podem liberar
          novos fundos secretos.
        </p>
      </div>

      <!-- 🎨 cor fundo -->
      <div v-if="backgroundMode === 'color'" class="field">
        <label class="section-label">Cor de fundo</label>
        <div class="color-field">
          <input type="color" v-model="backgroundColor" />
          <input type="text" v-model="backgroundColor" />
        </div>
      </div>

      <!-- 🖼️ CARROSSEL -->
      <div v-if="backgroundMode === 'image'" ref="imageFieldRef" class="field">
        <p v-if="showUnlockNotice || hasEaster" class="unlock-hint">
          {{
            showUnlockNotice
              ? 'Novo fundo secreto desbloqueado'
              : 'Você tem fundo secreto disponível'
          }}
        </p>
        <ImageCarousel
          :items="availableImages"
          :selected-image="backgroundImage"
          @select="handleSelectImage"
        />
      </div>

      <!-- 🎨 cor texto -->
      <div class="field">
        <label>Cor do texto</label>
        <div class="color-field">
          <input type="color" v-model="textColor" />
          <input type="text" v-model="textColor" />
        </div>
      </div>

      <!-- ✍️ tipografia -->
      <div class="field">
        <Select
          v-model="fontFamily"
          label="Fonte"
          :options="[
            { label: 'Noto Serif', value: `'Noto Serif', serif` },
            { label: 'Be Vietnam Pro', value: `'Be Vietnam Pro', sans-serif` },
            { label: 'Playfair Display', value: `'Playfair Display', serif` },
            {
              label: 'Cormorant Garamond',
              value: `'Cormorant Garamond', serif`,
            },
            { label: 'Poppins', value: `'Poppins', sans-serif` },
            { label: 'Nunito Sans', value: `'Nunito Sans', sans-serif` },
            { label: 'Merriweather', value: `'Merriweather', serif` },
          ]"
        />

        <div class="font-style-row">
          <label><input type="checkbox" v-model="isBold" /> Negrito</label>
          <label><input type="checkbox" v-model="isItalic" /> Itálico</label>
        </div>
      </div>

      <!-- DOWNLOAD -->
      <button class="download-btn" :disabled="props.isDownloading">
        {{ props.isDownloading ? 'Gerando...' : 'Baixar cartão' }}
      </button>
    </form>

    <Modal v-model="isHelpOpen" title="Enigmas secretos">
      <p>
        Digite as pistas no campo <strong>Mensagem</strong> para desbloquear os
        backgrounds secretos. (Disponível apenas para o modo foto de fundo)
      </p>
      <p class="secret-note">
        Exemplo direto: tente escrever <code>qui ama</code>.
      </p>
      <ul class="trigger-list">
        <li>Um recado infantil que jura ser verdadeiro.</li>
        <li>Quando o cérebro calcula, mas nada faz sentido.</li>
        <li>Quando a melhor resposta é: "prefiro não opinar".</li>
        <li>Quando bate o sono e só uma bebida resolve.</li>
        <li>Aquela resposta curta de quem não leva desaforo.</li>
        <li>
          Quando você olha ao redor sem entender nada e só consegue dizer:
          "corre aqui".
        </li>
      </ul>
      <p class="secret-note">
        Dica: acentos e pequenas variacoes podem funcionar.
      </p>
    </Modal>
  </Card>
</template>

<style scoped>
.card-form {
  position: relative;
  display: grid;
  gap: 0.95rem;
}

.card-form-title {
  margin: 0;
  font-size: 1.2rem;
}

.field {
  display: grid;
  gap: 0.45rem;
  padding: 0.7rem;
  border: 1px solid var(--color-surface-border);
  border-radius: 12px;
  background: color-mix(in srgb, var(--color-surface) 92%, white);
}

.field label {
  font-size: 0.88rem;
  font-weight: 600;
}

.background-mode-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}

.background-mode-field {
  gap: 0.6rem;
}

.mode-hint {
  margin: 0;
  font-size: 0.83rem;
  opacity: 0.82;
}

.background-mode-row label,
.font-style-row label {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid var(--color-surface-border);
  padding: 0.55rem 0.65rem;
  border-radius: 10px;
  cursor: pointer;
  background: var(--color-surface);
}

.color-field {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 0.55rem;
}

.color-field input[type='color'] {
  width: 42px;
  height: 38px;
  border: 1px solid var(--color-surface-border);
  border-radius: 8px;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.color-field input[type='text'] {
  border: 1px solid var(--color-surface-border);
  border-radius: 8px;
  padding: 0.55rem 0.65rem;
  font-size: 0.88rem;
}

.font-style-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}

.download-btn {
  margin-top: 0.25rem;
  height: 44px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.94rem;
  color: #fff;
  background: linear-gradient(135deg, #1d8f72, #2f6dff);
  cursor: pointer;
  transition:
    transform 0.15s ease,
    filter 0.15s ease;
}

.download-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

.download-btn:disabled {
  cursor: wait;
  opacity: 0.7;
}

.secret-help-btn {
  position: absolute;
  top: -2px;
  right: 0;
  height: 30px;
  border-radius: 999px;
  border: 1px solid var(--color-surface-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: 0.76rem;
  padding: 0 0.65rem;
  font-weight: 700;
  cursor: pointer;
}

.unlock-hint {
  margin: 0;
  border: 1px solid #f2d27b;
  background: #fff4cd;
  color: #6a4d00;
  padding: 0.45rem 0.6rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  text-align: center;
  animation: unlock-pulse 1.2s ease-in-out 2;
}

@keyframes unlock-pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(242, 210, 123, 0.6);
  }
  50% {
    transform: scale(1.01);
    box-shadow: 0 0 0 8px rgba(242, 210, 123, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(242, 210, 123, 0);
  }
}

.trigger-list {
  margin: 0.6rem 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.25rem;
  font-size: 0.88rem;
}

.secret-note {
  margin: 0;
  opacity: 0.8;
  font-size: 0.85rem;
}
</style>
