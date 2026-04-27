<script setup lang="ts">
import html2canvas from 'html2canvas';
import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import SealForm from '../components/seal/SealForm.vue';
import SealPreview from '../components/seal/SealPreview.vue';
import { useUniqueCartGiftNames } from '../composables/useUniqueCartGiftNames';
import Modal from '../components/ui/Modal.vue';
import { gifts } from '../data/gifts';
import type { Gift } from '../types/gift';
import type { SealFormState, SealStyle } from '../types/seal';

interface PreviewExpose {
  getElement: () => HTMLElement | null;
}

const route = useRoute();

const sealStyles: SealStyle[] = [
  {
    id: 'classic',
    label: 'Clássico Dourado',
    background: 'linear-gradient(140deg, #fff6d9 0%, #f4e9be 100%)',
    border: '#c9a22d',
  },
  {
    id: 'garden',
    label: 'Jardim Suave',
    background: 'linear-gradient(140deg, #edf6eb 0%, #dcead9 100%)',
    border: '#7ea07a',
  },
  {
    id: 'night',
    label: 'Noite Elegante',
    background: 'linear-gradient(140deg, #2f312f 0%, #454845 100%)',
    border: '#d4af37',
  },
];

const uniqueGiftNames = useUniqueCartGiftNames();

const form = reactive<SealFormState>({
  guestName: '',
  message: '',
  styleId: sealStyles[0].id,
  backgroundColor: '#fff6d9',
  textColor: '#2f2500',
  fontFamily: "'Noto Serif', serif",
  isBold: false,
  isItalic: false,
});

const previewRef = ref<PreviewExpose | null>(null);
const isDownloading = ref(false);
const isModalOpen = ref(false);
const modalTitle = ref('Aviso');
const modalMessage = ref('');

const activeStyle = computed(
  () => sealStyles.find((style) => style.id === form.styleId) ?? sealStyles[0],
);

function showModal(title: string, message: string): void {
  modalTitle.value = title;
  modalMessage.value = message;
  isModalOpen.value = true;
}

function buildFileName(name: string): string {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return normalized ? `selo-casamento-${normalized}.png` : 'selo-casamento.png';
}

async function downloadSeal(): Promise<void> {
  if (!form.guestName.trim()) {
    showModal('Campo obrigatório', 'Informe seu nome para gerar o selo.');
    return;
  }

  const previewElement = previewRef.value?.getElement();

  if (!previewElement) {
    showModal('Erro', 'Não foi possível preparar o selo para download.');
    return;
  }

  isDownloading.value = true;

  try {
    const canvas = await html2canvas(previewElement, {
      scale: 2,
      backgroundColor: null,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = buildFileName(form.guestName);
    link.click();

    showModal('Pronto', 'Seu selo foi gerado com sucesso.');
  } catch {
    showModal(
      'Erro',
      'Não foi possível gerar a imagem agora. Tente novamente.',
    );
  } finally {
    isDownloading.value = false;
  }
}
</script>

<template>
  <section class="page-container seal-page">
    <header class="intro">
      <h1 class="page-title">Criação de Selos</h1>
      <p class="page-subtitle">
        Esse Selo é apenas um lembrete que vai ser enviado para os noivos no dia
        do casamento, pensonalize como você achar melhor.
      </p>
    </header>

    <div class="grid">
      <SealPreview
        ref="previewRef"
        :gifts-names="uniqueGiftNames"
        :guest-name="form.guestName"
        :message="form.message"
        :selected-style="activeStyle"
        :background-color="form.backgroundColor"
        :text-color="form.textColor"
        :font-family="form.fontFamily"
        :is-bold="form.isBold"
        :is-italic="form.isItalic"
      />

      <SealForm
        v-model:guest-name="form.guestName"
        v-model:message="form.message"
        v-model:style-id="form.styleId"
        v-model:background-color="form.backgroundColor"
        v-model:text-color="form.textColor"
        v-model:font-family="form.fontFamily"
        v-model:is-bold="form.isBold"
        v-model:is-italic="form.isItalic"
        :styles="sealStyles"
        :is-downloading="isDownloading"
        @download="downloadSeal"
      />
    </div>

    <Modal v-model="isModalOpen" :title="modalTitle">
      <p>{{ modalMessage }}</p>
    </Modal>
  </section>
</template>

<style scoped>
.seal-page {
  display: grid;
  gap: var(--space-8);
}

.intro {
  text-align: center;
}

.grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: minmax(0, 1fr);
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
  }
}
</style>
