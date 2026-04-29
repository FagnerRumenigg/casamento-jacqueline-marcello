<script setup lang="ts">
import BaseField from './BaseField.vue';

const model = defineModel<string>({ default: '' });

const props = withDefaults(
  defineProps<{
    id?: string;
    label: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
  }>(),
  {
    placeholder: '',
    type: 'text',
    required: false,
  },
);
</script>

<template>
  <BaseField :label="props.label" :required="props.required" v-slot="{ id }">
    <input
      :id="id"
      v-model="model"
      class="control"
      :placeholder="props.placeholder"
      :type="props.type"
      :required="props.required"
    />
  </BaseField>
</template>

<style scoped>
.control {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--color-surface-border);
  background: white;
  transition: all 0.15s;
}

.control:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px
    color-mix(in srgb, var(--color-primary) 20%, transparent);
}
</style>
