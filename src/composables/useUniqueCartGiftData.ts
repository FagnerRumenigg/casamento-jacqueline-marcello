import { computed } from 'vue';
import { useGiftCart } from '../stores/giftCart';

export function useUniqueCartGiftData() {
  const { cartItems } = useGiftCart();
  return computed(() => {
    const seen = new Set<string>();
    return cartItems.value
      .map((item) => item.gift)
      .filter((gift) => {
        if (seen.has(gift.id)) return false;
        seen.add(gift.id);
        return true;
      });
  });
}
