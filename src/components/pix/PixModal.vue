<script setup lang="ts">
import QRCode from 'qrcode';
import { computed, ref, watch } from 'vue';

import Button from '../ui/Button.vue';
import { generatePixPayload } from '../../utils/pix';

const props = defineProps<{
  open: boolean;
  cartItems?: Array<{
    gift: { name: string; price: number };
    quantity: number;
  }>;
  giftName?: string;
  amount?: number;
}>();

const emit = defineEmits<{
  close: [];
}>();

const payload = ref('');
const qrCodeUrl = ref('');
const isGenerating = ref(false);
const errorMessage = ref('');
const copyFeedback = ref('');
const customMessage = ref('');
const editableAmount = ref(props.amount ?? 0);

// Removido: formatter não utilizado

const hasAmount = computed(
  () =>
    typeof editableAmount.value === 'number' &&
    Number.isFinite(editableAmount.value),
);

const description = computed(() => {
  if (customMessage.value.trim()) {
    return customMessage.value.trim();
  }
  if (props.cartItems && props.cartItems.length > 0) {
    return (
      'Presentes: ' +
      props.cartItems
        .map((item) => `${item.gift.name} x${item.quantity}`)
        .join(', ')
    );
  }
  if (props.giftName) {
    return `Presente: ${props.giftName}`;
  }
  return 'Presente de casamento';
});

async function buildPixCode(): Promise<void> {
  isGenerating.value = true;
  errorMessage.value = '';
  copyFeedback.value = '';
  console.info('[PixModal] Iniciando geracao de payload Pix', {
    giftName: props.giftName,
    amount: props.amount,
    description: description.value,
  });

  try {
    const generatedPayload = await generatePixPayload({
      amount: hasAmount.value ? editableAmount.value : undefined,
    });
    console.info('[PixModal] Payload Pix gerado', {
      payloadSize: generatedPayload.length,
    });

    payload.value = generatedPayload;
    qrCodeUrl.value = await QRCode.toDataURL(generatedPayload);
    console.info('[PixModal] QR Code Pix gerado com sucesso');
  } catch (error) {
    payload.value = '';
    qrCodeUrl.value = '';
    errorMessage.value = 'Não foi possível gerar o QR Code Pix agora.';
    console.error('[PixModal] Falha ao gerar Pix/QR Code', error);
  } finally {
    isGenerating.value = false;
  }
}

async function copyPix(): Promise<void> {
  if (!payload.value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(payload.value);
    copyFeedback.value = 'Código Pix copiado.';
    window.setTimeout(() => {
      copyFeedback.value = '';
    }, 1800);
  } catch {
    copyFeedback.value = 'Não foi possível copiar agora.';
  }
}

function closeModal(): void {
  emit('close');
}

watch(
  () => [props.open, props.giftName, props.amount],
  ([isOpen, _giftName, amount]) => {
    if (isOpen) {
      editableAmount.value = typeof amount === 'number' ? amount : 0;
      void buildPixCode();
    }
  },
);
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="props.open" class="modal-backdrop" @click.self="closeModal">
        <section
          class="modal surface-card"
          role="dialog"
          aria-modal="true"
          aria-label="Contribua com os noivos"
        >
          <header class="modal__header">
            <h2>Contribua com os noivos 💖</h2>
            <p>Escaneie o QR Code ou copie o código abaixo para contribuir.</p>
          </header>

          <div class="modal__content">
            <div v-if="hasAmount" class="amount amount-editable">
              <label for="editableAmount">Valor sugerido:</label>
              <input
                id="editableAmount"
                type="number"
                min="0.01"
                step="0.01"
                v-model.number="editableAmount"
                @input="buildPixCode"
                class="amount-input"
              />
              <span class="amount-currency">R$</span>
            </div>

            <p class="description">{{ description }}</p>
            <ul
              v-if="props.cartItems && props.cartItems.length > 0"
              class="cart-list-pix"
            >
              <li
                v-for="item in props.cartItems"
                :key="item.gift.name"
                class="cart-list-pix-item"
              >
                {{ item.gift.name }}
                <span class="cart-list-pix-qty">x{{ item.quantity }}</span>
              </li>
            </ul>

            <div v-if="isGenerating" class="status">Gerando QR Code Pix...</div>
            <p v-else-if="errorMessage" class="status status--error">
              {{ errorMessage }}
            </p>
            <img
              v-else-if="qrCodeUrl"
              :src="qrCodeUrl"
              alt="QR Code Pix para contribuição"
              class="qr-image"
            />

            <label class="payload-field" for="pixPayload">Código Pix</label>
            <textarea
              id="pixPayload"
              :value="payload"
              readonly
              rows="4"
              class="payload-textarea"
            />

            <p v-if="copyFeedback" class="status">{{ copyFeedback }}</p>
          </div>

          <footer class="modal__footer">
            <Button variant="ghost" @click="closeModal">Fechar</Button>
            <Button @click="copyPix">Copiar código Pix</Button>
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
  z-index: 95;
  background: rgba(32, 24, 3, 0.5);
  display: grid;
  place-items: center;
  padding: var(--space-5);
}

.modal {
  width: min(100%, 520px);
  padding: var(--space-6);
  max-height: 90vh;
  overflow-y: auto;
}
.cart-list-pix {
  margin: 0 0 var(--space-2) 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 2px;
}
.cart-list-pix-item {
  color: var(--color-text-muted);
  font-size: 0.98rem;
}
.cart-list-pix-qty {
  color: var(--color-primary);
  font-weight: 600;
}

.modal__header h2 {
  margin: 0;
  color: var(--color-primary);
  font-family: var(--font-display);
}

.modal__header p {
  margin: var(--space-2) 0 0;
  color: var(--color-text-muted);
}

.modal__content {
  margin-top: var(--space-5);
  display: grid;
  gap: var(--space-3);
}

.amount {
  margin: 0;
  color: var(--color-primary);
  font-weight: 600;
}

.description {
  margin: 0;
  color: var(--color-text-muted);
}

.qr-image {
  width: min(100%, 240px);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-surface-border);
}

.payload-field {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.payload-textarea {
  width: 100%;
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface-muted);
  padding: var(--space-3);
  color: var(--color-text);
  resize: none;
}

.status {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.status--error {
  color: var(--color-danger);
}

.modal__footer {
  margin-top: var(--space-5);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .modal__footer {
    flex-direction: column;
  }
}
</style>
