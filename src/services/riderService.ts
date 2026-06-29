/**
 * RasaanGo — Rider Service
 */
import api from './api';
import type { RiderStats, DeliveryRequest, RiderDelivery, EarningEntry } from '../types';

export const riderService = {
    goOnline: () =>
        api.post<{ status: string }>('/rider/status', { online: true }),

    goOffline: () =>
        api.post<{ status: string }>('/rider/status', { online: false }),

    getPendingOrders: () =>
        api.get<DeliveryRequest[]>('/rider/orders/pending'),

    acceptOrder: (orderId: string) =>
        api.post<RiderDelivery>(`/rider/orders/${orderId}/accept`, {}),

    updateDeliveryStatus: (orderId: string, status: string) =>
        api.patch<RiderDelivery>(`/rider/orders/${orderId}/status`, { status }),

    getEarnings: (period?: string) =>
        api.get<{ stats: RiderStats; history: EarningEntry[] }>(
            `/rider/earnings${period ? `?period=${period}` : ''}`
        ),
};

export default riderService;
