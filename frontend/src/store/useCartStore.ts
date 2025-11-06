import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

type NewItem = Omit<CartItem, "quantity">;

interface CartState {
  cart: CartItem[];
  addToCart: (item: NewItem) => boolean;
  removeFromCart: (itemId: number) => void;
  replaceCart: (item: NewItem) => void;
  clearCart: () => void;
  updateItemPrice: (itemId: number, newPrice: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (item) => {
        const { cart } = get();
        const currentStoreId = cart[0]?.storeId;

        if (currentStoreId && currentStoreId !== item.storeId) return false;

        const existing = cart.find((c) => c.id === item.id);
        set({
          cart: existing
            ? cart.map((c) =>
                c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
              )
            : [...cart, { ...item, quantity: 1 }],
        });
        return true;
      },

      removeFromCart: (itemId) => {
        const { cart } = get();
        const item = cart.find((c) => c.id === itemId);

        set({
          cart:
            item && item.quantity > 1
              ? cart.map((c) =>
                  c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
                )
              : cart.filter((c) => c.id !== itemId),
        });
      },

      replaceCart: (item) => set({ cart: [{ ...item, quantity: 1 }] }),

      clearCart: () => set({ cart: [] }),

      updateItemPrice: (itemId, newPrice) =>
        set({
          cart: get().cart.map((c) =>
            c.id === itemId ? { ...c, price: newPrice } : c
          ),
        }),

      getTotalItems: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () =>
        get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: "cart-storage" }
  )
);
