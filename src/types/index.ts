/**
 * RasaanGo — Core Types
 */

// User roles
export type UserRole = 'customer' | 'rider' | 'seller';

// Auth types
export interface User {
    id: string;
    name: string;
    phone: string;
    role: UserRole;
    avatar?: string;
    isFamilyAccount: boolean;
    familyPin?: string;
    isAnonymous: boolean;
    language: 'en' | 'ur';
}

export interface FamilyMember {
    id: string;
    name: string;
    pin: string;
    role: 'order' | 'order_sell' | 'ride';
    icon: string;
}

export interface FamilyAccount {
    id: string;
    headName: string;
    headPhone: string;
    members: FamilyMember[];
    createdAt: string;
}

// Category
export interface Category {
    id: string;
    name: string;
    nameUr: string;
    icon: string;
    color: string;
    bgColor: string;
}

// Shop
export interface Shop {
    id: string;
    name: string;
    nameUr: string;
    category: string;
    image: string;
    rating: number;
    totalRatings: number;
    distance: string;
    deliveryTime: string;
    isOpen: boolean;
    address: string;
}

// Product
export interface Product {
    id: string;
    shopId: string;
    name: string;
    nameUr: string;
    price: number;
    image: string;
    category: string;
    inStock: boolean;
    unit?: string;
}

// Cart
export interface CartItem {
    product: Product;
    quantity: number;
}

// Order
export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'picked_up'
    | 'on_the_way'
    | 'delivered'
    | 'cancelled';

export interface Order {
    id: string;
    items: CartItem[];
    shop: Shop;
    status: OrderStatus;
    total: number;
    deliveryFee: number;
    deliveryAddress: string;
    landmark: string;
    isAnonymous: boolean;
    leaveAtDoor: boolean;
    riderName?: string;
    riderRating?: number;
    eta?: string;
    createdAt: string;
}

// Rider
export interface RiderStats {
    todayEarnings: number;
    todayDeliveries: number;
    weekEarnings: number;
    weekDeliveries: number;
    monthEarnings: number;
    monthDeliveries: number;
    rating: number;
}

export interface DeliveryRequest {
    id: string;
    shopName: string;
    shopAddress: string;
    deliveryAddress: string;
    deliveryLandmark: string;
    itemCount: number;
    distance: string;
    earnings: number;
    timeLeft: number;
}

export interface RiderDelivery {
    id: string;
    orderId: string;
    shopName: string;
    shopAddress: string;
    deliveryAddress: string;
    deliveryLandmark: string;
    itemCount: number;
    customerName?: string;
    isAnonymous: boolean;
    status: 'heading_to_shop' | 'at_shop' | 'picked_up' | 'heading_to_customer' | 'delivered';
    earnings: number;
    distance: string;
}

export interface EarningEntry {
    id: string;
    orderId: string;
    amount: number;
    shopName: string;
    date: string;
    time: string;
}

export type EarningsPeriod = 'daily' | 'weekly' | 'monthly';

// Seller
export interface SellerStats {
    todayOrders: number;
    todaySales: number;
    rating: number;
}

export interface SellerOrder {
    id: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    status: 'new' | 'accepted' | 'preparing' | 'ready' | 'picked_up';
    createdAt: string;
    customerName?: string;
    deliveryAddress?: string;
    isAnonymous?: boolean;
}

export interface SellerProduct {
    id: string;
    name: string;
    nameUr: string;
    price: number;
    image: string;
    category: string;
    inStock: boolean;
    unit?: string;
    description?: string;
}

// Privacy & Settings
export interface PrivacySettings {
    anonymousByDefault: boolean;
    leaveAtDoorDefault: boolean;
    maskedCalling: boolean;
    shareLocation: boolean;
}

export interface NotificationSettings {
    orderUpdates: boolean;
    promotions: boolean;
    riderAlerts: boolean;
    sounds: boolean;
}
