import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Order, OrderStatus, CartItem, Shop } from '../types';

export interface OrderState {
    orders: Order[];
    isLoading: boolean;
    error: string | null;

    // Computed
    activeOrders: () => Order[];
    pastOrders: () => Order[];

    // Actions
    placeOrder: (order: Order) => void;
    fetchOrders: () => Promise<void>;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    cancelOrder: (orderId: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

let orderCounter = 1000;

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            orders: [],
            isLoading: false,
            error: null,

            activeOrders: () =>
                get().orders.filter(
                    (o) => !['delivered', 'cancelled'].includes(o.status)
                ),

            pastOrders: () =>
                get().orders.filter((o) =>
                    ['delivered', 'cancelled'].includes(o.status)
                ),

            placeOrder: (order) => {
                set((state) => ({
                    orders: [order, ...state.orders],
                }));

                // Simulate order lifecycle for demo
                setTimeout(() => {
                    get().updateOrderStatus(order.id, 'preparing');
                }, 5000);
                setTimeout(() => {
                    get().updateOrderStatus(order.id, 'picked_up');
                }, 15000);
                setTimeout(() => {
                    get().updateOrderStatus(order.id, 'on_the_way');
                }, 25000);
            },

            fetchOrders: async () => {
                set({ isLoading: true, error: null });
                try {
                    // TODO: Replace with real API call
                    // const response = await orderService.getOrders();
                    // set({ orders: response.data, isLoading: false });

                    // For now, just stop loading (orders are already in state)
                    set({ isLoading: false });
                } catch (err: any) {
                    set({ error: err.message || 'Failed to fetch orders', isLoading: false });
                }
            },

            updateOrderStatus: (orderId, status) =>
                set((state) => ({
                    orders: state.orders.map((o) =>
                        o.id === orderId
                            ? {
                                ...o,
                                status,
                                ...(status === 'on_the_way'
                                    ? { riderName: 'Ahmed', riderRating: 4.9, eta: '12 min' }
                                    : {}),
                            }
                            : o
                    ),
                })),

            cancelOrder: (orderId) =>
                set((state) => ({
                    orders: state.orders.map((o) =>
                        o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus } : o
                    ),
                })),

            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
        }),
        {
            name: 'rasaango-orders',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                orders: state.orders,
            }),
        }
    )
);
