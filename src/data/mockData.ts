import { Category, Shop, Product, Order, RiderStats, DeliveryRequest, SellerOrder, SellerStats } from '../types';

/**
 * Mock data for MVP development — replace with real API calls
 */

export const CATEGORIES: Category[] = [
    { id: '1', name: 'Grocery', nameUr: 'گروسری', icon: '🛒', color: '#1B7A4E', bgColor: '#E8F5E9' },
    { id: '2', name: 'Food', nameUr: 'کھانا', icon: '🍕', color: '#E11D48', bgColor: '#FFF1F2' },
    { id: '3', name: 'Medicine', nameUr: 'دوائی', icon: '💊', color: '#3B82F6', bgColor: '#EFF6FF' },
    { id: '4', name: 'Gas Cylinder', nameUr: 'گیس سلنڈر', icon: '⛽', color: '#F59E0B', bgColor: '#FFFBEB' },
    { id: '5', name: 'Hardware', nameUr: 'ہارڈ ویئر', icon: '🔧', color: '#6366F1', bgColor: '#EEF2FF' },
    { id: '6', name: 'Anything', nameUr: 'کچھ بھی', icon: '📦', color: '#8B5CF6', bgColor: '#F5F3FF' },
];

export const SHOPS: Shop[] = [
    {
        id: 's1',
        name: "Abdul's Karyana",
        nameUr: "عبدل کریانہ",
        category: '1',
        image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400',
        rating: 4.8,
        totalRatings: 156,
        distance: '1.2 km',
        deliveryTime: '15-20',
        isOpen: true,
        address: 'Main Bazaar, Skardu',
    },
    {
        id: 's2',
        name: 'Skardu Kitchen',
        nameUr: "سکردو کچن",
        category: '2',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
        rating: 4.9,
        totalRatings: 87,
        distance: '0.8 km',
        deliveryTime: '25-35',
        isOpen: true,
        address: 'Hussainabad, Skardu',
    },
    {
        id: 's3',
        name: 'Al-Shifa Medical',
        nameUr: "الشفاء میڈیکل",
        category: '3',
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
        rating: 4.7,
        totalRatings: 203,
        distance: '2.0 km',
        deliveryTime: '20-30',
        isOpen: true,
        address: 'Hospital Road, Skardu',
    },
    {
        id: 's4',
        name: 'Hassan Hardware',
        nameUr: "حسن ہارڈ ویئر",
        category: '5',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
        rating: 4.5,
        totalRatings: 64,
        distance: '1.5 km',
        deliveryTime: '20-25',
        isOpen: false,
        address: 'Yadgar Chowk, Skardu',
    },
    {
        id: 's5',
        name: 'Balti Food Corner',
        nameUr: "بلتی فوڈ کارنر",
        category: '2',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        rating: 4.6,
        totalRatings: 112,
        distance: '3.1 km',
        deliveryTime: '30-40',
        isOpen: true,
        address: 'Alamdar Chowk, Skardu',
    },
];

export const PRODUCTS: Product[] = [
    // Abdul's Karyana products
    { id: 'p1', shopId: 's1', name: 'Aata 10kg', nameUr: 'آٹا ۱۰ کلو', price: 1200, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300', category: 'Flour', inStock: true, unit: '10kg' },
    { id: 'p2', shopId: 's1', name: 'Rice Basmati 5kg', nameUr: 'چاول باسمتی ۵ کلو', price: 800, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', category: 'Rice', inStock: true, unit: '5kg' },
    { id: 'p3', shopId: 's1', name: 'Cooking Oil 1L', nameUr: 'کھانا پکانے کا تیل', price: 450, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300', category: 'Oil', inStock: true, unit: '1L' },
    { id: 'p4', shopId: 's1', name: 'Sugar 2kg', nameUr: 'چینی ۲ کلو', price: 320, image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300', category: 'Sugar', inStock: true, unit: '2kg' },
    { id: 'p5', shopId: 's1', name: 'Tea (Lipton) 200g', nameUr: 'چائے لپٹن', price: 280, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300', category: 'Tea', inStock: true, unit: '200g' },
    { id: 'p6', shopId: 's1', name: 'Daal Chana 1kg', nameUr: 'دال چنا ۱ کلو', price: 350, image: 'https://images.unsplash.com/photo-1585996986850-5e8b0b3b5c8e?w=300', category: 'Pulses', inStock: false, unit: '1kg' },
    // Skardu Kitchen products
    { id: 'p7', shopId: 's2', name: 'Chapshoro', nameUr: 'چپ شورو', price: 250, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300', category: 'Local Food', inStock: true },
    { id: 'p8', shopId: 's2', name: 'Momo (8 pcs)', nameUr: 'مومو ۸ پیس', price: 300, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300', category: 'Local Food', inStock: true },
    { id: 'p9', shopId: 's2', name: 'Mamtu (6 pcs)', nameUr: 'ممتو ۶ پیس', price: 350, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300', category: 'Local Food', inStock: true },
    { id: 'p10', shopId: 's2', name: 'Chai (Butter Tea)', nameUr: 'گرگر چائے', price: 100, image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300', category: 'Drinks', inStock: true },
];

export const MOCK_ORDERS: Order[] = [
    {
        id: '#1234',
        items: [
            { product: PRODUCTS[0], quantity: 1 },
            { product: PRODUCTS[2], quantity: 2 },
        ],
        shop: SHOPS[0],
        status: 'on_the_way',
        total: 2100,
        deliveryFee: 60,
        deliveryAddress: 'Hussaini Chowk',
        landmark: 'Green gate ke paas',
        isAnonymous: true,
        leaveAtDoor: false,
        riderName: 'Ahmed',
        riderRating: 4.9,
        eta: '12 min',
        createdAt: '2026-06-28T01:00:00',
    },
    {
        id: '#1230',
        items: [
            { product: PRODUCTS[6], quantity: 5 },
            { product: PRODUCTS[7], quantity: 3 },
        ],
        shop: SHOPS[1],
        status: 'delivered',
        total: 2150,
        deliveryFee: 80,
        deliveryAddress: 'Alamdar Chowk',
        landmark: 'Near Jamia Masjid',
        isAnonymous: false,
        leaveAtDoor: false,
        createdAt: '2026-06-27T18:00:00',
    },
];

export const MOCK_RIDER_STATS: RiderStats = {
    todayEarnings: 840,
    todayDeliveries: 12,
    weekEarnings: 5200,
    weekDeliveries: 68,
    monthEarnings: 22400,
    monthDeliveries: 287,
    rating: 4.9,
};

export const MOCK_DELIVERY_REQUEST: DeliveryRequest = {
    id: 'd1',
    shopName: "Abdul's Karyana",
    shopAddress: 'Main Bazaar, Skardu',
    deliveryAddress: 'Hussaini Chowk',
    deliveryLandmark: 'Green gate ke paas',
    itemCount: 3,
    distance: '2.5 km',
    earnings: 70,
    timeLeft: 30,
};

export const MOCK_SELLER_STATS: SellerStats = {
    todayOrders: 23,
    todaySales: 4500,
    rating: 4.8,
};

export const MOCK_SELLER_ORDERS: SellerOrder[] = [
    {
        id: '#1234',
        items: [
            { name: 'Aata 10kg', quantity: 1, price: 1200 },
            { name: 'Cooking Oil 1L', quantity: 2, price: 450 },
        ],
        total: 2100,
        status: 'new',
        createdAt: '2 min ago',
    },
    {
        id: '#1235',
        items: [
            { name: 'Rice 5kg', quantity: 1, price: 800 },
        ],
        total: 800,
        status: 'preparing',
        createdAt: '8 min ago',
    },
    {
        id: '#1236',
        items: [
            { name: 'Sugar 2kg', quantity: 3, price: 320 },
            { name: 'Tea Lipton', quantity: 1, price: 280 },
        ],
        total: 1240,
        status: 'ready',
        createdAt: '15 min ago',
    },
];
