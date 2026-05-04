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
    <transition name="modal">
      <div v-if="isOpen" class="modal-backdrop" @click.self="closeModal">
        <section
          class="modal"
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
            <Button fullWidth @click="closeModal">
              {{ props.closeLabel }}
            </Button>
          </footer>
        </section>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
/* backdrop mais suave */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(20, 16, 4, 0.55);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  padding: var(--space-5);
}

/* modal */
.modal {
  width: min(100%, 420px);
  padding: var(--space-6);
  border-radius: 18px;
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* header */
.modal__header h2 {
  font-family: var(--font-display);
  font-size: 1.4rem;
  margin: 0;
  color: var(--color-primary);
}

/* conteúdo */
.modal__content {
  margin-top: var(--space-4);
  margin-bottom: var(--space-4);
  color: var(--color-text-muted);
  line-height: 1.4;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: var(--space-2);
}

.modal__content::-webkit-scrollbar {
  width: 6px;
}

.modal__content::-webkit-scrollbar-track {
  background: transparent;
}

.modal__content::-webkit-scrollbar-thumb {
  background: var(--color-surface-border);
  border-radius: 3px;
}

.modal__content::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}

/* footer */
.modal__footer {
  margin-top: var(--space-6);
}

/* animação mais viva */
.modal-enter-active,
.modal-leave-active {
  transition: all 180ms ease;
}

.modal-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}

.modal-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}
</style>
