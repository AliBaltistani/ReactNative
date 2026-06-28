import api from './api';
import type { SellerOrder, SellerStats } from '../types';
import { MOCK_SELLER_STATS, MOCK_SELLER_ORDERS } from '../data/mockData';

/**
 * Seller service — manage shop orders, products, and stats.
 */
export const sellerService = {
    async getSellerStats(): Promise<SellerStats> {
        try {
            const { data } = await api.get<{ data: SellerStats }>('/seller/stats');
            return data.data;
        } catch {
            return MOCK_SELLER_STATS;
        }
    },

    async getSellerOrders(): Promise<SellerOrder[]> {
        try {
            const { data } = await api.get<{ data: SellerOrder[] }>('/seller/orders');
            return data.data;
        } catch {
            return MOCK_SELLER_ORDERS;
        }
    },

    async acceptOrder(orderId: string): Promise<boolean> {
        try {
            await api.post(`/seller/orders/${orderId}/accept`);
            return true;
        } catch {
            return true;
        }
    },

    async rejectOrder(orderId: string): Promise<boolean> {
        try {
            await api.post(`/seller/orders/${orderId}/reject`);
            return true;
        } catch {
            return true;
        }
    },

    async updateOrderStatus(
        orderId: string,
        status: 'preparing' | 'ready'
    ): Promise<boolean> {
        try {
            await api.post(`/seller/orders/${orderId}/status`, { status });
            return true;
        } catch {
            return true;
        }
    },

    async toggleShopOpen(isOpen: boolean): Promise<boolean> {
        try {
            await api.post('/seller/shop/toggle', { isOpen });
            return true;
        } catch {
            return true;
        }
    },
};
