import { computed, ref } from 'vue';

import type { Gift } from '../types/gift';

export interface CartItem {
  gift: Gift;
  quantity: number;
}

const STORAGE_KEY = 'cashback-casamento-cart';

function loadInitialCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as CartItem[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) =>
        typeof item?.gift?.id === 'string' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

const cartItems = ref<CartItem[]>(loadInitialCart());
const lastSelectedGiftId = ref<string | null>(null);

function persistCart(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems.value));
}

function addGift(gift: Gift): void {
  const existing = cartItems.value.find((item) => item.gift.id === gift.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cartItems.value.push({ gift, quantity: 1 });
  }

  lastSelectedGiftId.value = gift.id;

  persistCart();
}

function removeGift(giftId: string): void {
  cartItems.value = cartItems.value.filter((item) => item.gift.id !== giftId);
  persistCart();
}

function clearCart(): void {
  cartItems.value = [];
  persistCart();
}

const cartCount = computed(() =>
  cartItems.value.reduce((total, item) => total + item.quantity, 0),
);

const cartTotal = computed(() =>
  cartItems.value.reduce(
    (total, item) => total + item.gift.price * item.quantity,
    0,
  ),
);

const firstGiftId = computed(() => cartItems.value[0]?.gift.id ?? null);

const selectedGift = computed<Gift | null>(() => {
  if (lastSelectedGiftId.value) {
    const match = cartItems.value.find(
      (item) => item.gift.id === lastSelectedGiftId.value,
    );

    if (match) {
      return match.gift;
    }
  }

  return cartItems.value[0]?.gift ?? null;
});

const hasItems = computed(() => cartItems.value.length > 0);

export function useGiftCart() {
  return {
    cartItems,
    cartCount,
    cartTotal,
    firstGiftId,
    selectedGift,
    hasItems,
    addGift,
    removeGift,
    clearCart,
  };
}
