<script setup lang="ts">
import Button from './Button.vue';

const isOpen = defineModel<boolean>({ default: false });

const props = withDefaults(
  defineProps<{
    title?: string;
    closeLabel?: string;
  }>(),
  {
    title: 'Aviso',
    closeLabel: 'Fechar',
  },
);

function closeModal(): void {
  isOpen.value = false;
}
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="isOpen" class="modal-backdrop" @click.self="closeModal">
        <section
          class="modal surface-card"
          role="dialog"
          aria-modal="true"
          :aria-label="props.title"
        >
          <header class="modal__header">
            <h2>{{ props.title }}</h2>
          </header>
          <div class="modal__content">
            <slot />
          </div>
          <footer class="modal__footer">
            <Button @click="closeModal">{{ props.closeLabel }}</Button>
          </footer>
        </section>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(32, 24, 3, 0.5);
  display: grid;
  place-items: center;
  padding: var(--space-5);
}

.modal {
  width: min(100%, 440px);
  padding: var(--space-6);
}

.modal__header h2 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  margin: 0;
  color: var(--color-primary);
}

.modal__content {
  margin-top: var(--space-4);
  color: var(--color-text-muted);
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-6);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
