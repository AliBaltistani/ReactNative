/**
 * RasaanGo — Seller Service
 */
import api from './api';
import type { SellerStats, SellerOrder, SellerProduct } from '../types';

export const sellerService = {
    getDashboard: () =>
        api.get<{ stats: SellerStats; orders: SellerOrder[] }>('/seller/dashboard'),

    getProducts: () =>
        api.get<SellerProduct[]>('/seller/products'),

    addProduct: (data: Omit<SellerProduct, 'id'>) =>
        api.post<SellerProduct>('/seller/products', data as Record<string, unknown>),

    updateProduct: (id: string, data: Partial<SellerProduct>) =>
        api.put<SellerProduct>(`/seller/products/${id}`, data as Record<string, unknown>),

    deleteProduct: (id: string) =>
        api.delete<{ success: boolean }>(`/seller/products/${id}`),

    getOrders: (status?: string) =>
        api.get<SellerOrder[]>(`/seller/orders${status ? `?status=${status}` : ''}`),

    updateOrderStatus: (id: string, status: string) =>
        api.patch<SellerOrder>(`/seller/orders/${id}/status`, { status }),
};

export default sellerService;
