<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import PixModal from '../components/pix/PixModal.vue';
import Button from '../components/ui/Button.vue';
import Card from '../components/ui/Card.vue';
import { useGiftCart } from '../stores/giftCart';

const { cartItems, cartTotal, hasItems, removeGift, addGift } = useGiftCart();

// PIX STATES E LÓGICA
import QRCode from 'qrcode';
import { generatePixPayload } from '../utils/pix';
const payload = ref('');
const qrCodeUrl = ref('');
const isGenerating = ref(false);
const errorMessage = ref('');
const copyFeedback = ref('');
const editableAmount = ref(cartTotal.value);

const hasAmount = computed(
  () =>
    typeof editableAmount.value === 'number' &&
    Number.isFinite(editableAmount.value),
);

async function buildPixCode() {
  isGenerating.value = true;
  errorMessage.value = '';
  copyFeedback.value = '';
  try {
    const generatedPayload = await generatePixPayload({
      amount: hasAmount.value ? editableAmount.value : undefined,
    });
    payload.value = generatedPayload;
    qrCodeUrl.value = await QRCode.toDataURL(generatedPayload);
  } catch (error) {
    payload.value = '';
    qrCodeUrl.value = '';
    errorMessage.value = 'Não foi possível gerar o QR Code Pix agora.';
  } finally {
    isGenerating.value = false;
  }
}

async function copyPix() {
  if (!payload.value) return;
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

watch(
  [cartItems, editableAmount],
  () => {
    buildPixCode();
  },
  { immediate: true },
);

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const totalItemsLabel = computed(() =>
  cartItems.value.reduce((total, item) => total + item.quantity, 0),
);

const isPixModalOpen = ref(false);

function handleClosePixModal(): void {
  isPixModalOpen.value = false;
}
</script>

<template>
  <section class="page-container cart-page">
    <header class="intro">
      <h1 class="page-title">Carrinho de Presentes</h1>
      <p class="page-subtitle">
        Revise seus presentes e siga para a criação dos selos.
      </p>
    </header>

    <div v-if="!hasItems" class="empty-state surface-card">
      <h2>Seu carrinho está vazio</h2>
      <p>Escolha um presente na lista para continuar.</p>
      <RouterLink to="/">
        <Button>Voltar para presentes</Button>
      </RouterLink>
    </div>

    <div v-else class="cart-grid">
      <Card class="cart-list">
        <h2>Itens selecionados</h2>

        <ul>
          <li v-for="item in cartItems" :key="item.gift.id" class="cart-item">
            <div class="item-main">
              <strong>{{ item.gift.name }}</strong>
              <span>{{ formatter.format(item.gift.price) }}</span>
            </div>

            <div class="cart-qty-controls">
              <button
                class="qty-btn"
                @click="
                  () =>
                    item.quantity > 1 &&
                    (item.quantity--,
                    removeGift(item.gift.id),
                    addGift(item.gift))
                "
                :disabled="item.quantity <= 1"
                type="button"
              >
                -
              </button>

              <span class="qty-value">{{ item.quantity }}</span>

              <button
                class="qty-btn"
                @click="() => addGift(item.gift)"
                type="button"
              >
                +
              </button>
            </div>

            <Button variant="ghost" @click="removeGift(item.gift.id)">
              Remover
            </Button>
          </li>
        </ul>
      </Card>

      <Card class="cart-summary">
        <h2>Resumo</h2>
        <p>{{ totalItemsLabel }} item(ns)</p>
        <p class="total">{{ formatter.format(cartTotal) }}</p>

        <section class="pix-summary">
          <h3>Contribua com os noivos 💖</h3>
          <p>Escaneie o QR Code ou copie o código abaixo.</p>

          <div v-if="cartTotal > 0" class="amount amount-editable">
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

          <!-- <p class="description">{{ pixDescription }}</p> -->

          <!-- CÓDIGO PIX PRIMEIRO -->
          <div v-if="payload" class="pix-payload-block">
            <label class="payload-field">Código Pix</label>

            <textarea
              :value="payload"
              readonly
              rows="4"
              class="payload-textarea"
            ></textarea>
          </div>

          <!-- STATUS -->
          <div v-if="isGenerating" class="status">Gerando QR Code Pix...</div>

          <p v-else-if="errorMessage" class="status status--error">
            {{ errorMessage }}
          </p>

          <!-- QR CODE POR ÚLTIMO -->
          <img
            v-else-if="qrCodeUrl"
            :src="qrCodeUrl"
            alt="QR Code Pix"
            class="qr-image"
          />

          <p v-if="copyFeedback" class="status">{{ copyFeedback }}</p>

          <Button @click="copyPix">Copiar código Pix</Button>
        </section>
      </Card>
    </div>

    <PixModal
      :open="isPixModalOpen"
      :cart-items="cartItems"
      :amount="cartTotal"
      @close="handleClosePixModal"
    />
  </section>
</template>

<style scoped>
.cart-page {
  display: grid;
  gap: var(--space-8);
}

.intro {
  text-align: center;
}

.cart-grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: minmax(0, 1fr);
}

.cart-list,
.cart-summary {
  padding: var(--space-6);
}

/* 🔥 CORREÇÃO DO LABEL + CAMPO */
.pix-payload-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.payload-field {
  font-weight: 600;
}

.payload-textarea {
  resize: none;
  width: 100%;
  padding: 8px;
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  font-family: monospace;
}

/* CONTROLES DE QUANTIDADE */
.cart-qty-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--color-surface-muted);
  border-radius: var(--radius-pill);
  padding: 4px 12px;
  margin-top: 4px;
  margin-bottom: 4px;
}

.qty-btn {
  background: var(--color-primary);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s;
  font-weight: bold;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--color-surface-border);
  color: var(--color-text-muted);
}

qty-value {
  min-width: 2em;
  text-align: center;
  font-weight: 700;
  color: var(--color-primary);
  font-size: 1.1rem;
  background: #fff;
  border-radius: 6px;
  padding: 2px 8px;
  border: 1px solid var(--color-surface-border);
}

/* resto mantido */

.total {
  font-size: 2rem;
  color: var(--color-primary);
}

@media (min-width: 980px) {
  .cart-grid {
    grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
  }
}
</style>
