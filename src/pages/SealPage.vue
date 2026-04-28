<script setup lang="ts">
import html2canvas from 'html2canvas';
import { computed, reactive, ref } from 'vue';
// import { useRoute } from 'vue-router'; // removido pois não é utilizado

import SealForm from '../components/seal/SealForm.vue';
import SealPreview from '../components/seal/SealPreview.vue';
import { useUniqueCartGiftNames } from '../composables/useUniqueCartGiftNames';
import Modal from '../components/ui/Modal.vue';
import type { SealFormState, SealStyle } from '../types/seal';

interface PreviewExpose {
  getElement: () => HTMLElement | null;
}

// const route = useRoute(); // removido pois não é utilizado

// 🎨 estilos
const sealStyles: SealStyle[] = [
  {
    id: 'classic',
    label: 'Clássico',
    shape: 'square',
    background: '#fff6d9',
    border: '#c9a22d',
  },
  {
    id: 'romantic',
    label: 'Romântico',
    shape: 'rounded',
    background: '#fde2e4',
    border: '#e5989b',
  },
  {
    id: 'modern',
    label: 'Oval',
    shape: 'pill',
    background: '#edf6f9',
    border: '#83c5be',
  },
  {
    id: 'premium',
    label: 'Circular',
    shape: 'circle',
    background: '#2f312f',
    border: '#d4af37',
  },
];

const uniqueGiftNames = useUniqueCartGiftNames();

// 🧠 STATE
const form = reactive<SealFormState>({
  guestName: '',
  message: '',
  styleId: sealStyles[0].id,

  backgroundColor: '#fff6d9',
  backgroundImage: '',
  backgroundMode: 'color',

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

// 🎯 estilo ativo
const activeStyle = computed(() => {
  return sealStyles.find((style) => style.id === form.styleId) || sealStyles[0];
});

// 📢 modal
function showModal(title: string, message: string): void {
  modalTitle.value = title;
  modalMessage.value = message;
  isModalOpen.value = true;
}

// 📥 download
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
    link.download = `selo-${form.guestName}.png`;
    link.click();

    showModal('Pronto', 'Seu selo foi gerado com sucesso.');
  } catch {
    showModal('Erro', 'Não foi possível gerar a imagem.');
  } finally {
    isDownloading.value = false;
  }
}
</script>

<template>
  <section class="page-container seal-page">
    <header class="intro">
      <h1 class="page-title">Criação de Experiências</h1>
      <p class="page-subtitle">
        Personalize seu selo e mande aquele carinho pros noivos 💛
      </p>
    </header>

    <div class="grid">
      <div class="preview-wrapper">
        <SealPreview
          ref="previewRef"
          :giftsNames="uniqueGiftNames"
          :guestName="form.guestName"
          :message="form.message"
          :selectedStyle="activeStyle"
          :backgroundColor="form.backgroundColor"
          :backgroundImage="form.backgroundImage"
          :backgroundMode="form.backgroundMode"
          :textColor="form.textColor"
          :fontFamily="form.fontFamily"
          :isBold="form.isBold"
          :isItalic="form.isItalic"
        />
      </div>

      <SealForm
        v-model:guestName="form.guestName"
        v-model:message="form.message"
        v-model:styleId="form.styleId"
        v-model:backgroundColor="form.backgroundColor"
        v-model:backgroundImage="form.backgroundImage"
        v-model:backgroundMode="form.backgroundMode"
        v-model:textColor="form.textColor"
        v-model:fontFamily="form.fontFamily"
        v-model:isBold="form.isBold"
        v-model:isItalic="form.isItalic"
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
  padding: 0 1rem; /* 👈 evita grudar na borda */
}

.intro {
  text-align: center;
}

.grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
}

/* 🔥 STICKY AQUI */
.preview-wrapper {
  position: sticky;
  top: 24px;
  align-self: start;
}

/* 💻 desktop */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}
</style>
