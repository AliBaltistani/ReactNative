/**
 * RasaanGo — Order Service
 */
import api from './api';
import type { Order, OrderStatus } from '../types';

export interface CreateOrderPayload {
    shopId: string;
    items: { productId: string; quantity: number }[];
    deliveryAddress: string;
    landmark: string;
    isAnonymous: boolean;
    leaveAtDoor: boolean;
    paymentMethod: string;
}

export const orderService = {
    create: (data: CreateOrderPayload) =>
        api.post<Order>('/orders', data),

    getAll: () =>
        api.get<Order[]>('/orders'),

    getById: (id: string) =>
        api.get<Order>(`/orders/${id}`),

    updateStatus: (id: string, status: OrderStatus) =>
        api.patch<Order>(`/orders/${id}/status`, { status }),

    rateOrder: (id: string, rating: number) =>
        api.post<{ success: boolean }>(`/orders/${id}/rate`, { rating }),
};

export default orderService;
