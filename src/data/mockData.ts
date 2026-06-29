import {
    Category, Shop, Product, Order, RiderStats, DeliveryRequest,
    SellerOrder, SellerStats, FamilyAccount, RiderDelivery, EarningEntry,
    SellerProduct,
} from '../types';

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
    {
        id: 's6',
        name: 'Skardu Gas Agency',
        nameUr: "سکردو گیس ایجنسی",
        category: '4',
        image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400',
        rating: 4.3,
        totalRatings: 45,
        distance: '2.8 km',
        deliveryTime: '30-45',
        isOpen: true,
        address: 'Airport Road, Skardu',
    },
    {
        id: 's7',
        name: 'Fatima Home Kitchen',
        nameUr: "فاطمہ ہوم کچن",
        category: '2',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        rating: 4.9,
        totalRatings: 34,
        distance: '1.0 km',
        deliveryTime: '30-40',
        isOpen: true,
        address: 'Hussainabad, Skardu',
    },
    {
        id: 's8',
        name: 'Ali General Store',
        nameUr: "علی جنرل اسٹور",
        category: '1',
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400',
        rating: 4.4,
        totalRatings: 92,
        distance: '0.5 km',
        deliveryTime: '10-15',
        isOpen: true,
        address: 'Alamdar Chowk, Skardu',
    },
];

export const PRODUCTS: Product[] = [
    // Abdul's Karyana products (s1)
    { id: 'p1', shopId: 's1', name: 'Aata 10kg', nameUr: 'آٹا ۱۰ کلو', price: 1200, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300', category: 'Flour', inStock: true, unit: '10kg' },
    { id: 'p2', shopId: 's1', name: 'Rice Basmati 5kg', nameUr: 'چاول باسمتی ۵ کلو', price: 800, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', category: 'Rice', inStock: true, unit: '5kg' },
    { id: 'p3', shopId: 's1', name: 'Cooking Oil 1L', nameUr: 'کھانا پکانے کا تیل', price: 450, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300', category: 'Oil', inStock: true, unit: '1L' },
    { id: 'p4', shopId: 's1', name: 'Sugar 2kg', nameUr: 'چینی ۲ کلو', price: 320, image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300', category: 'Sugar', inStock: true, unit: '2kg' },
    { id: 'p5', shopId: 's1', name: 'Tea (Lipton) 200g', nameUr: 'چائے لپٹن', price: 280, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300', category: 'Tea', inStock: true, unit: '200g' },
    { id: 'p6', shopId: 's1', name: 'Daal Chana 1kg', nameUr: 'دال چنا ۱ کلو', price: 350, image: 'https://images.unsplash.com/photo-1585996986850-5e8b0b3b5c8e?w=300', category: 'Pulses', inStock: false, unit: '1kg' },
    { id: 'p11', shopId: 's1', name: 'Milk 1L', nameUr: 'دودھ ۱ لیٹر', price: 200, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300', category: 'Dairy', inStock: true, unit: '1L' },
    { id: 'p12', shopId: 's1', name: 'Eggs (12 pack)', nameUr: 'انڈے ۱۲ عدد', price: 300, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300', category: 'Dairy', inStock: true, unit: '12 pcs' },
    // Skardu Kitchen products (s2)
    { id: 'p7', shopId: 's2', name: 'Chapshoro', nameUr: 'چپ شورو', price: 250, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300', category: 'Local Food', inStock: true },
    { id: 'p8', shopId: 's2', name: 'Momo (8 pcs)', nameUr: 'مومو ۸ پیس', price: 300, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300', category: 'Local Food', inStock: true },
    { id: 'p9', shopId: 's2', name: 'Mamtu (6 pcs)', nameUr: 'ممتو ۶ پیس', price: 350, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300', category: 'Local Food', inStock: true },
    { id: 'p10', shopId: 's2', name: 'Chai (Butter Tea)', nameUr: 'گرگر چائے', price: 100, image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300', category: 'Drinks', inStock: true },
    { id: 'p13', shopId: 's2', name: 'Balti Biryani', nameUr: 'بلتی بریانی', price: 400, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300', category: 'Local Food', inStock: true },
    // Al-Shifa Medical products (s3)
    { id: 'p14', shopId: 's3', name: 'Panadol (10 tabs)', nameUr: 'پینا ڈول', price: 50, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300', category: 'Pain Relief', inStock: true, unit: '10 tabs' },
    { id: 'p15', shopId: 's3', name: 'Cough Syrup', nameUr: 'کھانسی کا شربت', price: 180, image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300', category: 'Cold & Flu', inStock: true, unit: '100ml' },
    { id: 'p16', shopId: 's3', name: 'Bandage Roll', nameUr: 'پٹی', price: 80, image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300', category: 'First Aid', inStock: true },
    // Skardu Gas Agency (s6)
    { id: 'p17', shopId: 's6', name: 'Gas Cylinder (Full)', nameUr: 'گیس سلنڈر (بھرا)', price: 2500, image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=300', category: 'Gas', inStock: true },
    { id: 'p18', shopId: 's6', name: 'Gas Regulator', nameUr: 'گیس ریگولیٹر', price: 600, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300', category: 'Gas', inStock: true },
    // Fatima Home Kitchen (s7)
    { id: 'p19', shopId: 's7', name: 'Homemade Bread (5 pcs)', nameUr: 'گھر کی روٹی', price: 150, image: 'https://images.unsplash.com/photo-1549931319-a545753467c8?w=300', category: 'Bakery', inStock: true },
    { id: 'p20', shopId: 's7', name: 'Apricot Cake', nameUr: 'خوبانی کیک', price: 500, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300', category: 'Bakery', inStock: true },
    { id: 'p21', shopId: 's7', name: 'Dried Apricots 500g', nameUr: 'خشک خوبانی', price: 350, image: 'https://images.unsplash.com/photo-1596591868231-05475f3109e7?w=300', category: 'Dry Fruits', inStock: true, unit: '500g' },
    // Ali General Store (s8)
    { id: 'p22', shopId: 's8', name: 'Salt 1kg', nameUr: 'نمک', price: 60, image: 'https://images.unsplash.com/photo-1518110925495-5fe2c8e28bac?w=300', category: 'Spices', inStock: true, unit: '1kg' },
    { id: 'p23', shopId: 's8', name: 'Red Chilli Powder', nameUr: 'لال مرچ', price: 150, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300', category: 'Spices', inStock: true, unit: '250g' },
    { id: 'p24', shopId: 's8', name: 'Ghee 1kg', nameUr: 'گھی', price: 900, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300', category: 'Dairy', inStock: true, unit: '1kg' },
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
        id: '#1233',
        items: [
            { product: PRODUCTS[13], quantity: 2 },
            { product: PRODUCTS[14], quantity: 1 },
        ],
        shop: SHOPS[2],
        status: 'preparing',
        total: 280,
        deliveryFee: 50,
        deliveryAddress: 'Airport Road',
        landmark: 'Near school',
        isAnonymous: false,
        leaveAtDoor: false,
        createdAt: '2026-06-28T02:00:00',
    },
    {
        id: '#1230',
        items: [
            { product: PRODUCTS[8], quantity: 5 },
            { product: PRODUCTS[9], quantity: 3 },
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
    {
        id: '#1228',
        items: [
            { product: PRODUCTS[0], quantity: 2 },
            { product: PRODUCTS[3], quantity: 1 },
            { product: PRODUCTS[4], quantity: 3 },
        ],
        shop: SHOPS[0],
        status: 'delivered',
        total: 3560,
        deliveryFee: 60,
        deliveryAddress: 'Hussainabad',
        landmark: 'Blue gate house',
        isAnonymous: true,
        leaveAtDoor: true,
        riderName: 'Hussain',
        riderRating: 4.7,
        createdAt: '2026-06-26T10:00:00',
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

export const MOCK_RIDER_DELIVERY: RiderDelivery = {
    id: 'rd1',
    orderId: '#1234',
    shopName: "Abdul's Karyana",
    shopAddress: 'Main Bazaar, Skardu',
    deliveryAddress: 'Hussaini Chowk',
    deliveryLandmark: 'Green gate ke paas',
    itemCount: 3,
    isAnonymous: true,
    status: 'heading_to_shop',
    earnings: 70,
    distance: '2.5 km',
};

export const MOCK_EARNINGS_HISTORY: EarningEntry[] = [
    { id: 'e1', orderId: '#1234', amount: 70, shopName: "Abdul's Karyana", date: '2026-06-28', time: '10:30 AM' },
    { id: 'e2', orderId: '#1233', amount: 50, shopName: 'Al-Shifa Medical', date: '2026-06-28', time: '09:15 AM' },
    { id: 'e3', orderId: '#1232', amount: 80, shopName: 'Skardu Kitchen', date: '2026-06-28', time: '08:45 AM' },
    { id: 'e4', orderId: '#1231', amount: 60, shopName: "Abdul's Karyana", date: '2026-06-28', time: '08:00 AM' },
    { id: 'e5', orderId: '#1230', amount: 80, shopName: 'Skardu Kitchen', date: '2026-06-27', time: '09:30 PM' },
    { id: 'e6', orderId: '#1229', amount: 70, shopName: 'Ali General Store', date: '2026-06-27', time: '08:00 PM' },
    { id: 'e7', orderId: '#1228', amount: 60, shopName: "Abdul's Karyana", date: '2026-06-27', time: '06:30 PM' },
    { id: 'e8', orderId: '#1227', amount: 90, shopName: 'Skardu Gas Agency', date: '2026-06-27', time: '04:00 PM' },
    { id: 'e9', orderId: '#1226', amount: 50, shopName: 'Fatima Home Kitchen', date: '2026-06-27', time: '02:00 PM' },
    { id: 'e10', orderId: '#1225', amount: 70, shopName: "Abdul's Karyana", date: '2026-06-27', time: '12:00 PM' },
    { id: 'e11', orderId: '#1224', amount: 60, shopName: 'Al-Shifa Medical', date: '2026-06-27', time: '10:30 AM' },
    { id: 'e12', orderId: '#1223', amount: 80, shopName: 'Skardu Kitchen', date: '2026-06-27', time: '09:00 AM' },
];

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
        isAnonymous: true,
        deliveryAddress: 'Hussaini Chowk',
    },
    {
        id: '#1235',
        items: [
            { name: 'Rice 5kg', quantity: 1, price: 800 },
        ],
        total: 800,
        status: 'preparing',
        createdAt: '8 min ago',
        isAnonymous: false,
        customerName: 'Ahmed Khan',
        deliveryAddress: 'Yadgar Chowk',
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
        isAnonymous: false,
        customerName: 'Hussain Ali',
        deliveryAddress: 'Airport Road',
    },
    {
        id: '#1237',
        items: [
            { name: 'Milk 1L', quantity: 2, price: 200 },
            { name: 'Eggs (12 pack)', quantity: 1, price: 300 },
        ],
        total: 700,
        status: 'new',
        createdAt: '1 min ago',
        isAnonymous: true,
        deliveryAddress: 'Hussainabad',
    },
    {
        id: '#1238',
        items: [
            { name: 'Daal Chana 1kg', quantity: 2, price: 350 },
        ],
        total: 700,
        status: 'picked_up',
        createdAt: '25 min ago',
        customerName: 'Sajid Raza',
        deliveryAddress: 'Alamdar Chowk',
    },
];

export const MOCK_SELLER_PRODUCTS: SellerProduct[] = [
    { id: 'sp1', name: 'Aata 10kg', nameUr: 'آٹا ۱۰ کلو', price: 1200, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300', category: 'Flour', inStock: true, unit: '10kg' },
    { id: 'sp2', name: 'Rice Basmati 5kg', nameUr: 'چاول باسمتی ۵ کلو', price: 800, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', category: 'Rice', inStock: true, unit: '5kg' },
    { id: 'sp3', name: 'Cooking Oil 1L', nameUr: 'کھانا پکانے کا تیل', price: 450, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300', category: 'Oil', inStock: true, unit: '1L' },
    { id: 'sp4', name: 'Sugar 2kg', nameUr: 'چینی ۲ کلو', price: 320, image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300', category: 'Sugar', inStock: true, unit: '2kg' },
    { id: 'sp5', name: 'Tea (Lipton) 200g', nameUr: 'چائے لپٹن', price: 280, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300', category: 'Tea', inStock: true, unit: '200g' },
    { id: 'sp6', name: 'Daal Chana 1kg', nameUr: 'دال چنا ۱ کلو', price: 350, image: 'https://images.unsplash.com/photo-1585996986850-5e8b0b3b5c8e?w=300', category: 'Pulses', inStock: false, unit: '1kg' },
    { id: 'sp7', name: 'Milk 1L', nameUr: 'دودھ ۱ لیٹر', price: 200, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300', category: 'Dairy', inStock: true, unit: '1L' },
    { id: 'sp8', name: 'Eggs (12 pack)', nameUr: 'انڈے ۱۲ عدد', price: 300, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300', category: 'Dairy', inStock: true, unit: '12 pcs' },
];

export const MOCK_FAMILY_ACCOUNT: FamilyAccount = {
    id: 'f1',
    headName: 'Muhammad Ali',
    headPhone: '+92 345 1234567',
    members: [
        { id: 'fm1', name: 'Fatima', pin: '1234', role: 'order', icon: '🧕' },
        { id: 'fm2', name: 'Zainab', pin: '5678', role: 'order_sell', icon: '🧕' },
        { id: 'fm3', name: 'Hassan', pin: '9012', role: 'ride', icon: '👦' },
    ],
    createdAt: '2026-06-01',
};
