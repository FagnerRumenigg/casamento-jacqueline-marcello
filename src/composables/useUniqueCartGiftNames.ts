import { computed } from 'vue';
import { useGiftCart } from '../stores/giftCart';

export function useUniqueCartGiftNames() {
  const { cartItems } = useGiftCart();
  return computed(() => {
    const seen = new Set<string>();
    return cartItems.value
      .map((item) => item.gift.name)
      .filter((name) => {
        if (seen.has(name)) return false;
        seen.add(name);
        return true;
      });
  });
}
