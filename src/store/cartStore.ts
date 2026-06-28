import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Product, CartItem } from '../types';

export interface CartState {
    items: CartItem[];
    shopId: string | null;
    shopName: string;

    // Delivery prefs
    isAnonymous: boolean;
    leaveAtDoor: boolean;
    deliveryAddress: string;
    landmark: string;

    // Computed-style getters
    totalItems: () => number;
    subtotal: () => number;
    deliveryFee: () => number;
    grandTotal: () => number;

    // Actions
    addItem: (product: Product, shopId: string, shopName: string) => boolean;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    setAnonymous: (val: boolean) => void;
    setLeaveAtDoor: (val: boolean) => void;
    setDeliveryAddress: (address: string) => void;
    setLandmark: (landmark: string) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            shopId: null,
            shopName: '',
            isAnonymous: false,
            leaveAtDoor: false,
            deliveryAddress: '',
            landmark: '',

            totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
            subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
            deliveryFee: () => {
                const total = get().subtotal();
                if (total === 0) return 0;
                if (total > 2000) return 40;
                return 60;
            },
            grandTotal: () => get().subtotal() + get().deliveryFee(),

            addItem: (product, shopId, shopName) => {
                const state = get();

                // If cart has items from a different shop, reject (caller should prompt user)
                if (state.shopId && state.shopId !== shopId && state.items.length > 0) {
                    return false; // Signal: different shop conflict
                }

                const existing = state.items.find((i) => i.product.id === product.id);
                if (existing) {
                    set({
                        items: state.items.map((i) =>
                            i.product.id === product.id
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        ),
                    });
                } else {
                    set({
                        items: [...state.items, { product, quantity: 1 }],
                        shopId,
                        shopName,
                    });
                }
                return true;
            },

            removeItem: (productId) =>
                set((state) => {
                    const newItems = state.items.filter((i) => i.product.id !== productId);
                    return {
                        items: newItems,
                        shopId: newItems.length === 0 ? null : state.shopId,
                        shopName: newItems.length === 0 ? '' : state.shopName,
                    };
                }),

            updateQuantity: (productId, quantity) =>
                set((state) => {
                    if (quantity <= 0) {
                        const newItems = state.items.filter((i) => i.product.id !== productId);
                        return {
                            items: newItems,
                            shopId: newItems.length === 0 ? null : state.shopId,
                            shopName: newItems.length === 0 ? '' : state.shopName,
                        };
                    }
                    return {
                        items: state.items.map((i) =>
                            i.product.id === productId ? { ...i, quantity } : i
                        ),
                    };
                }),

            clearCart: () =>
                set({
                    items: [],
                    shopId: null,
                    shopName: '',
                    deliveryAddress: '',
                    landmark: '',
                    isAnonymous: false,
                    leaveAtDoor: false,
                }),

            setAnonymous: (val) => set({ isAnonymous: val }),
            setLeaveAtDoor: (val) => set({ leaveAtDoor: val }),
            setDeliveryAddress: (address) => set({ deliveryAddress: address }),
            setLandmark: (landmark) => set({ landmark }),
        }),
        {
            name: 'rasaango-cart',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                items: state.items,
                shopId: state.shopId,
                shopName: state.shopName,
                isAnonymous: state.isAnonymous,
                leaveAtDoor: state.leaveAtDoor,
                deliveryAddress: state.deliveryAddress,
                landmark: state.landmark,
            }),
        }
    )
);
