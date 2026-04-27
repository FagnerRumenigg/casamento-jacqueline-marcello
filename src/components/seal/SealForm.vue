<script setup lang="ts">
import { computed } from 'vue';

import type { SealStyle } from '../../types/seal';
import Button from '../ui/Button.vue';
import Card from '../ui/Card.vue';
import Input from '../ui/Input.vue';
import Select from '../ui/Select.vue';
import Textarea from '../ui/Textarea.vue';

const guestName = defineModel<string>('guestName', { default: '' });
const message = defineModel<string>('message', { default: '' });
const styleId = defineModel<string>('styleId', { default: '' });
const backgroundColor = defineModel<string>('backgroundColor', {
  default: '#fff6d9',
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

const styleOptions = computed(() =>
  props.styles.map((style) => ({ label: style.label, value: style.id })),
);

const typographyOptions = [
  { label: 'Noto Serif', value: "'Noto Serif', serif" },
  { label: 'Be Vietnam Pro', value: "'Be Vietnam Pro', sans-serif" },
  { label: 'Georgia', value: 'Georgia, serif' },
];

function handleDownload(): void {
  emit('download');
}
</script>

<template>
  <Card>
    <form class="form" @submit.prevent="handleDownload">
      <h2>Personalize seu selo</h2>

      <Input
        id="guestName"
        v-model="guestName"
        label="Nome"
        placeholder="Digite seu nome"
        :required="true"
      />

      <Textarea
        id="message"
        v-model="message"
        label="Mensagem"
        placeholder="Escreva uma mensagem para os noivos"
        :rows="4"
      />

      <Select
        id="styleId"
        v-model="styleId"
        label="Estilo do selo"
        :options="styleOptions"
      />

      <div class="color-grid">
        <Input
          id="backgroundColor"
          v-model="backgroundColor"
          label="Cor de fundo"
          type="color"
        />
        <Input
          id="textColor"
          v-model="textColor"
          label="Cor do texto"
          type="color"
        />
      </div>

      <Select
        id="fontFamily"
        v-model="fontFamily"
        label="Tipografia"
        :options="typographyOptions"
      />

      <div class="toggle-row">
        <label class="toggle-control">
          <input v-model="isBold" type="checkbox" />
          <span>Negrito</span>
        </label>
        <label class="toggle-control">
          <input v-model="isItalic" type="checkbox" />
          <span>Italico</span>
        </label>
      </div>

      <Button type="submit" :full-width="true">
        {{ isDownloading ? 'Gerando imagem...' : 'Baixar selo em PNG' }}
      </Button>
    </form>
  </Card>
</template>

<style scoped>
.form {
  padding: var(--space-6);
  display: grid;
  gap: var(--space-4);
}

.form h2 {
  margin: 0;
  font-family: var(--font-display);
  color: var(--color-primary);
}

.color-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: 1fr 1fr;
}

.toggle-row {
  display: flex;
  gap: var(--space-6);
}

.toggle-control {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-muted);
}

@media (max-width: 550px) {
  .color-grid {
    grid-template-columns: 1fr;
  }
}
</style>
