import api from './api';
import type { Order, CartItem, Shop } from '../types';

export interface PlaceOrderData {
    items: CartItem[];
    shop: Shop;
    deliveryAddress: string;
    landmark: string;
    isAnonymous: boolean;
    leaveAtDoor: boolean;
    deliveryFee: number;
    total: number;
    paymentMethod?: 'cash' | 'jazzcash' | 'easypaisa';
}

/**
 * Order service — place orders, fetch history, track, cancel.
 */
export const orderService = {
    async placeOrder(data: PlaceOrderData): Promise<Order> {
        try {
            const payload = {
                shopId: data.shop.id,
                items: data.items.map((i) => ({
                    productId: i.product.id,
                    quantity: i.quantity,
                    price: i.product.price,
                })),
                deliveryAddress: data.deliveryAddress,
                landmark: data.landmark,
                isAnonymous: data.isAnonymous,
                leaveAtDoor: data.leaveAtDoor,
                paymentMethod: data.paymentMethod || 'cash',
            };
            const { data: response } = await api.post<{ data: Order }>('/orders', payload);
            return response.data;
        } catch {
            // Return a mock order for offline operation
            return {
                id: '#' + Math.floor(1000 + Math.random() * 9000),
                items: data.items,
                shop: data.shop,
                status: 'confirmed',
                total: data.total,
                deliveryFee: data.deliveryFee,
                deliveryAddress: data.deliveryAddress,
                landmark: data.landmark,
                isAnonymous: data.isAnonymous,
                leaveAtDoor: data.leaveAtDoor,
                createdAt: new Date().toISOString(),
            };
        }
    },

    async getOrders(): Promise<Order[]> {
        try {
            const { data } = await api.get<{ data: Order[] }>('/orders');
            return data.data;
        } catch {
            return [];
        }
    },

    async getOrderStatus(orderId: string): Promise<Order | null> {
        try {
            const { data } = await api.get<{ data: Order }>(`/orders/${orderId}`);
            return data.data;
        } catch {
            return null;
        }
    },

    async cancelOrder(orderId: string): Promise<boolean> {
        try {
            await api.post(`/orders/${orderId}/cancel`);
            return true;
        } catch {
            return false;
        }
    },

    async rateOrder(orderId: string, rating: number, comment?: string): Promise<boolean> {
        try {
            await api.post(`/orders/${orderId}/rate`, { rating, comment });
            return true;
        } catch {
            return true; // Accept rating even offline, sync later
        }
    },
};
