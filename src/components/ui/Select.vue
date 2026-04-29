<script setup lang="ts">
import BaseField from './BaseField.vue';

const model = defineModel<string>({ default: '' });

interface SelectOption {
  label: string;
  value: string;
}

const props = defineProps<{
  id?: string;
  label: string;
  options: SelectOption[];
  required?: boolean;
}>();
</script>

<template>
  <BaseField :label="label" :required="required" v-slot="{ id }">
    <select :id="id" v-model="model" class="select-control">
      <option disabled value="">Selecione...</option>

      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </BaseField>
</template>

<style scoped>
.select-control {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--color-surface-border);
  background: white;
  font-size: 0.9rem;

  /* remove aparência feia nativa */
  appearance: none;

  /* setinha custom */
  background-image: url("data:image/svg+xml;charset=UTF-8,<svg fill='%23999' viewBox='0 0 20 20'><path d='M5 7l5 5 5-5'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px;
}

.select-control:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px
    color-mix(in srgb, var(--color-primary) 20%, transparent);
}
</style>
