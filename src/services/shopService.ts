/**
 * RasaanGo — Shop Service
 */
import api from './api';
import type { Shop, Product } from '../types';

export const shopService = {
    getAll: (categoryId?: string) =>
        api.get<Shop[]>(`/shops${categoryId ? `?category=${categoryId}` : ''}`),

    getById: (id: string) =>
        api.get<Shop>(`/shops/${id}`),

    getProducts: (shopId: string) =>
        api.get<Product[]>(`/shops/${shopId}/products`),

    searchProducts: (query: string) =>
        api.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`),
};

export default shopService;
