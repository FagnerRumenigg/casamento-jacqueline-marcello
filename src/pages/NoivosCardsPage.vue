<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import PageHero from '../components/layout/PageHero.vue';
import Card from '../components/ui/Card.vue';

interface SavedCard {
  id: string;
  guestName: string;
  createdAt: string;
  imageUrl: string;
  messagePreview: string;
}

const route = useRoute();
const isLoading = ref(false);
const loadError = ref('');
const cards = ref<SavedCard[]>([]);
const selectedCard = ref<SavedCard | null>(null);

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim() ?? '';
const cardsTag = import.meta.env.VITE_CLOUDINARY_CARDS_TAG?.trim() ?? '';
const configuredKey = import.meta.env.VITE_NOIVOS_ACCESS_KEY?.trim() ?? '';
const queryKey = computed(() =>
  typeof route.query.key === 'string' ? route.query.key.trim() : '',
);

const isConfigured = computed(
  () => configuredKey.length > 0 && cloudName.length > 0 && cardsTag.length > 0,
);
const isAuthorized = computed(
  () => isConfigured.value && queryKey.value === configuredKey,
);
const totalCards = computed(() => cards.value.length);

function formatGuestName(publicId: string): string {
  return publicId
    .replace(/^cartao-/, '')
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatCreatedAt(value?: string): string {
  if (!value) return 'Data indisponível';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function buildCloudinaryImageUrl(item: {
  public_id: string;
  version?: number;
  format?: string;
}) {
  const versionPath = item.version ? `v${item.version}/` : '';
  const extension = item.format ? `.${item.format}` : '';

  return `https://res.cloudinary.com/${cloudName}/image/upload/${versionPath}${item.public_id}${extension}`;
}

async function loadCards() {
  if (!isAuthorized.value) return;

  isLoading.value = true;
  loadError.value = '';

  try {
    const response = await fetch(
      `https://res.cloudinary.com/${cloudName}/image/list/${cardsTag}.json`,
      {
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      throw new Error(
        'Não foi possível consultar a lista de cartões no Cloudinary.',
      );
    }

    const data = (await response.json()) as {
      resources?: Array<{
        public_id: string;
        asset_id?: string;
        version?: number;
        format?: string;
        secure_url?: string;
        url?: string;
        created_at?: string;
        context?: {
          custom?: {
            guest_name?: string;
            message_preview?: string;
          };
        };
      }>;
    };

    cards.value = (data.resources ?? []).map((item) => ({
      id: item.asset_id ?? item.public_id,
      guestName:
        item.context?.custom?.guest_name || formatGuestName(item.public_id),
      createdAt: formatCreatedAt(item.created_at),
      imageUrl:
        item.secure_url ?? item.url ?? buildCloudinaryImageUrl(item),
      messagePreview: item.context?.custom?.message_preview ?? '',
    }));
  } catch (error) {
    loadError.value =
      error instanceof Error
        ? error.message
        : 'Não foi possível carregar os cartões.';
  } finally {
    isLoading.value = false;
  }
}

function openCard(card: SavedCard) {
  selectedCard.value = card;
}

function closeCard() {
  selectedCard.value = null;
}

void loadCards();
</script>

<template>
  <section class="page-container noivos-page">
    <PageHero
      eyebrow="Área dos noivos"
      title="Cartões recebidos"
      description="Tela reservada para acompanhar os cartões enviados pelos convidados."
    >
      <template #title-extra>
        <span v-if="isAuthorized" class="count-pill">{{ totalCards }}</span>
      </template>
    </PageHero>

    <Card v-if="!isConfigured" class="status-card">
      <h2>Chave não configurada</h2>
      <p>
        Defina <code>VITE_NOIVOS_ACCESS_KEY</code> no
        <code>.env.local</code> para proteger esta rota.
      </p>
      <p>
        Tambem configure <code>VITE_CLOUDINARY_CLOUD_NAME</code> e
        <code>VITE_CLOUDINARY_CARDS_TAG</code> para habilitar a listagem.
      </p>
    </Card>

    <template v-else-if="!isAuthorized">
      <Card class="status-card">
        <h2>Acesso restrito</h2>
        <p>
          Abra esta pagina com a chave correta na URL.
          Exemplo:
          <code>/noivos/cartoes?key=sua-chave</code>
        </p>
      </Card>
    </template>

    <template v-else>
      <Card v-if="isLoading || loadError" class="status-card">
        <h2>{{ isLoading ? 'Carregando cartões' : 'Erro ao carregar' }}</h2>
        <p v-if="isLoading">Buscando cartões salvos no Cloudinary...</p>
        <p v-else>{{ loadError }}</p>
      </Card>

      <section v-if="cards.length > 0" class="cards-grid">
        <Card
          v-for="card in cards"
          :key="card.id"
          class="saved-card"
          padding="none"
          hover
          @click="openCard(card)"
        >
          <img :src="card.imageUrl" :alt="`Cartão de ${card.guestName}`" />
          <div class="saved-card__content">
            <strong>{{ card.guestName }}</strong>
            <span>{{ card.createdAt }}</span>
            <p>{{ card.messagePreview }}</p>
          </div>
        </Card>
      </section>

      <Card v-else class="empty-card">
        <h2>Nenhum cartão encontrado</h2>
        <p>
          Se você já enviou cartões e eles não apareceram aqui, confira a tag
          configurada no upload e na listagem.
        </p>
      </Card>
    </template>

    <teleport to="body">
      <transition name="viewer">
        <div
          v-if="selectedCard"
          class="viewer-backdrop"
          @click.self="closeCard"
        >
          <section class="viewer-modal" role="dialog" aria-modal="true">
            <img
              :src="selectedCard.imageUrl"
              :alt="`Cartão de ${selectedCard.guestName}`"
              class="viewer-image"
            />
            <div class="viewer-meta">
              <strong>{{ selectedCard.guestName }}</strong>
              <span>{{ selectedCard.createdAt }}</span>
              <p v-if="selectedCard.messagePreview">
                {{ selectedCard.messagePreview }}
              </p>
            </div>
          </section>
        </div>
      </transition>
    </teleport>
  </section>
</template>

<style scoped>
.noivos-page {
  display: grid;
  gap: var(--space-8);
}

.count-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  background: #000000;
  color: #ffffff;
  font-weight: 700;
}

.status-card,
.empty-card {
  display: grid;
  gap: var(--space-2);
}

.status-card h2,
.empty-card h2 {
  margin: 0;
  font-family: var(--font-display);
  color: var(--color-primary);
}

.status-card p,
.empty-card p {
  margin: 0;
  color: var(--color-text-muted);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.saved-card {
  overflow: hidden;
  cursor: zoom-in;
}

.saved-card img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.saved-card__content {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-4);
}

.saved-card__content strong {
  color: var(--color-primary);
  font-family: var(--font-display);
}

.saved-card__content span,
.saved-card__content p {
  color: var(--color-text-muted);
  margin: 0;
}

.viewer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 95;
  background: rgba(20, 16, 4, 0.72);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: var(--space-5);
}

.viewer-modal {
  width: min(100%, 980px);
  max-height: 92vh;
  overflow: auto;
  padding: var(--space-5);
  border-radius: 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
  display: grid;
  gap: var(--space-4);
}

.viewer-image {
  width: 100%;
  max-height: 72vh;
  object-fit: contain;
  background: color-mix(in srgb, var(--color-surface-muted) 78%, white);
  border-radius: 14px;
}

.viewer-meta {
  display: grid;
  gap: var(--space-2);
}

.viewer-meta strong {
  font-family: var(--font-display);
  color: var(--color-primary);
  font-size: 1.2rem;
}

.viewer-meta span,
.viewer-meta p {
  margin: 0;
  color: var(--color-text-muted);
}

.viewer-enter-active,
.viewer-leave-active {
  transition: opacity 180ms ease;
}

.viewer-enter-from,
.viewer-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .cards-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .viewer-modal {
    padding: var(--space-4);
  }
}
</style>
