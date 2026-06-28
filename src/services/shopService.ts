import api from './api';
import type { Category, Shop, Product } from '../types';
import { CATEGORIES, SHOPS, PRODUCTS } from '../data/mockData';

/**
 * Shop/product service — fetches categories, shops, products.
 * Falls back to mock data when API is unreachable.
 */
export const shopService = {
    async getCategories(): Promise<Category[]> {
        try {
            const { data } = await api.get<{ data: Category[] }>('/categories');
            return data.data;
        } catch {
            return CATEGORIES;
        }
    },

    async getShops(categoryId?: string): Promise<Shop[]> {
        try {
            const params = categoryId ? { category: categoryId } : {};
            const { data } = await api.get<{ data: Shop[] }>('/shops', { params });
            return data.data;
        } catch {
            if (categoryId) {
                return SHOPS.filter((s) => s.category === categoryId);
            }
            return SHOPS;
        }
    },

    async getShopById(shopId: string): Promise<Shop | null> {
        try {
            const { data } = await api.get<{ data: Shop }>(`/shops/${shopId}`);
            return data.data;
        } catch {
            return SHOPS.find((s) => s.id === shopId) || null;
        }
    },

    async getShopProducts(shopId: string): Promise<Product[]> {
        try {
            const { data } = await api.get<{ data: Product[] }>(`/shops/${shopId}/products`);
            return data.data;
        } catch {
            return PRODUCTS.filter((p) => p.shopId === shopId);
        }
    },

    async searchShops(query: string): Promise<Shop[]> {
        try {
            const { data } = await api.get<{ data: Shop[] }>('/shops/search', {
                params: { q: query },
            });
            return data.data;
        } catch {
            const q = query.toLowerCase();
            return SHOPS.filter(
                (s) =>
                    s.name.toLowerCase().includes(q) ||
                    s.nameUr.includes(query) ||
                    s.address.toLowerCase().includes(q)
            );
        }
    },
};
