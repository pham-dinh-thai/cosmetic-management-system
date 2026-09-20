import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productCode: string;
  name: string;
  variantName: string;
  price: number;
  imageUrl?: string | null;
  accent?: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export const formatVND = (value: number): string =>
  `${value.toLocaleString("vi-VN")}₫`;

export const cartCount = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.qty, 0);

export const cartSubtotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.price * item.qty, 0);

export const parsePrice = (value: string): number =>
  Number(value.replace(/\D/g, "")) || 0;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + (item.qty ?? 1) } : i,
              ),
            };
          }
          return {
            items: [...state.items, { ...item, qty: item.qty ?? 1 }],
          };
        }),

      increment: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, qty: i.qty + 1 } : i,
          ),
        })),

      decrement: (id) =>
        set((state) => ({
          items: state.items.flatMap((i) => {
            if (i.id !== id) return [i];
            if (i.qty <= 1) return [];
            return [{ ...i, qty: i.qty - 1 }];
          }),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "cosmetics_cart_store",
    },
  ),
);