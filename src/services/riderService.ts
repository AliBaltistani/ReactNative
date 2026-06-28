import api from './api';
import type { RiderStats, DeliveryRequest } from '../types';
import { MOCK_RIDER_STATS, MOCK_DELIVERY_REQUEST } from '../data/mockData';

/**
 * Rider service — go online/offline, manage deliveries, stats.
 */
export const riderService = {
    async goOnline(): Promise<boolean> {
        try {
            await api.post('/rider/online');
            return true;
        } catch {
            return true; // Accept offline toggling
        }
    },

    async goOffline(): Promise<boolean> {
        try {
            await api.post('/rider/offline');
            return true;
        } catch {
            return true;
        }
    },

    async getRiderStats(): Promise<RiderStats> {
        try {
            const { data } = await api.get<{ data: RiderStats }>('/rider/stats');
            return data.data;
        } catch {
            return MOCK_RIDER_STATS;
        }
    },

    async getDeliveryRequests(): Promise<DeliveryRequest[]> {
        try {
            const { data } = await api.get<{ data: DeliveryRequest[] }>('/rider/requests');
            return data.data;
        } catch {
            return [MOCK_DELIVERY_REQUEST];
        }
    },

    async acceptDelivery(id: string): Promise<boolean> {
        try {
            await api.post(`/rider/deliveries/${id}/accept`);
            return true;
        } catch {
            return true;
        }
    },

    async skipDelivery(id: string): Promise<boolean> {
        try {
            await api.post(`/rider/deliveries/${id}/skip`);
            return true;
        } catch {
            return true;
        }
    },

    async updateDeliveryStatus(
        id: string,
        status: 'picked_up' | 'on_the_way' | 'delivered'
    ): Promise<boolean> {
        try {
            await api.post(`/rider/deliveries/${id}/status`, { status });
            return true;
        } catch {
            return true;
        }
    },

    async updateLocation(lat: number, lng: number): Promise<void> {
        try {
            await api.post('/rider/location', { lat, lng });
        } catch {
            // Silent fail — location updates are best-effort
        }
    },
};
