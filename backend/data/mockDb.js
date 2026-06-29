/**
 * RasaanGo — Mock Database (In-Memory)
 */

const shops = [
    { id: 's1', name: "Abdul's Karyana", nameUr: "عبدل کریانہ", category: '1', image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400', rating: 4.8, totalRatings: 156, distance: '1.2 km', deliveryTime: '15-20', isOpen: true, address: 'Main Bazaar, Skardu' },
    { id: 's2', name: 'Skardu Kitchen', nameUr: "سکردو کچن", category: '2', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', rating: 4.9, totalRatings: 87, distance: '0.8 km', deliveryTime: '25-35', isOpen: true, address: 'Hussainabad, Skardu' },
    { id: 's3', name: 'Al-Shifa Medical', nameUr: "الشفاء میڈیکل", category: '3', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400', rating: 4.7, totalRatings: 203, distance: '2.0 km', deliveryTime: '20-30', isOpen: true, address: 'Hospital Road, Skardu' },
    { id: 's4', name: 'Hassan Hardware', nameUr: "حسن ہارڈ ویئر", category: '5', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400', rating: 4.5, totalRatings: 64, distance: '1.5 km', deliveryTime: '20-25', isOpen: false, address: 'Yadgar Chowk, Skardu' },
    { id: 's5', name: 'Balti Food Corner', nameUr: "بلتی فوڈ کارنر", category: '2', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', rating: 4.6, totalRatings: 112, distance: '3.1 km', deliveryTime: '30-40', isOpen: true, address: 'Alamdar Chowk, Skardu' },
    { id: 's6', name: 'Skardu Gas Agency', nameUr: "سکردو گیس ایجنسی", category: '4', rating: 4.3, totalRatings: 45, distance: '2.8 km', deliveryTime: '30-45', isOpen: true, address: 'Airport Road, Skardu', image: '' },
    { id: 's7', name: 'Fatima Home Kitchen', nameUr: "فاطمہ ہوم کچن", category: '2', rating: 4.9, totalRatings: 34, distance: '1.0 km', deliveryTime: '30-40', isOpen: true, address: 'Hussainabad, Skardu', image: '' },
    { id: 's8', name: 'Ali General Store', nameUr: "علی جنرل اسٹور", category: '1', rating: 4.4, totalRatings: 92, distance: '0.5 km', deliveryTime: '10-15', isOpen: true, address: 'Alamdar Chowk, Skardu', image: '' },
];

const products = [
    { id: 'p1', shopId: 's1', name: 'Aata 10kg', nameUr: 'آٹا ۱۰ کلو', price: 1200, category: 'Flour', inStock: true, unit: '10kg', image: '' },
    { id: 'p2', shopId: 's1', name: 'Rice Basmati 5kg', nameUr: 'چاول باسمتی', price: 800, category: 'Rice', inStock: true, unit: '5kg', image: '' },
    { id: 'p3', shopId: 's1', name: 'Cooking Oil 1L', nameUr: 'تیل', price: 450, category: 'Oil', inStock: true, unit: '1L', image: '' },
    { id: 'p4', shopId: 's1', name: 'Sugar 2kg', nameUr: 'چینی', price: 320, category: 'Sugar', inStock: true, unit: '2kg', image: '' },
    { id: 'p5', shopId: 's1', name: 'Tea 200g', nameUr: 'چائے', price: 280, category: 'Tea', inStock: true, unit: '200g', image: '' },
    { id: 'p7', shopId: 's2', name: 'Chapshoro', nameUr: 'چپ شورو', price: 250, category: 'Local Food', inStock: true, image: '' },
    { id: 'p8', shopId: 's2', name: 'Momo (8 pcs)', nameUr: 'مومو', price: 300, category: 'Local Food', inStock: true, image: '' },
    { id: 'p9', shopId: 's2', name: 'Mamtu (6 pcs)', nameUr: 'ممتو', price: 350, category: 'Local Food', inStock: true, image: '' },
    { id: 'p14', shopId: 's3', name: 'Panadol', nameUr: 'پینا ڈول', price: 50, category: 'Medicine', inStock: true, image: '' },
    { id: 'p15', shopId: 's3', name: 'Cough Syrup', nameUr: 'کھانسی شربت', price: 180, category: 'Medicine', inStock: true, image: '' },
    { id: 'p17', shopId: 's6', name: 'Gas Cylinder', nameUr: 'گیس سلنڈر', price: 2500, category: 'Gas', inStock: true, image: '' },
];

let orders = [];
let orderCounter = 1240;

const users = [];
const familyAccounts = [];

const riderStats = {
    todayEarnings: 840, todayDeliveries: 12,
    weekEarnings: 5200, weekDeliveries: 68,
    monthEarnings: 22400, monthDeliveries: 287,
    rating: 4.9,
};

const earningsHistory = [
    { id: 'e1', orderId: '#1234', amount: 70, shopName: "Abdul's Karyana", date: '2026-06-28', time: '10:30 AM' },
    { id: 'e2', orderId: '#1233', amount: 50, shopName: 'Al-Shifa Medical', date: '2026-06-28', time: '09:15 AM' },
    { id: 'e3', orderId: '#1232', amount: 80, shopName: 'Skardu Kitchen', date: '2026-06-28', time: '08:45 AM' },
    { id: 'e4', orderId: '#1231', amount: 60, shopName: "Abdul's Karyana", date: '2026-06-28', time: '08:00 AM' },
    { id: 'e5', orderId: '#1230', amount: 80, shopName: 'Skardu Kitchen', date: '2026-06-27', time: '09:30 PM' },
];

const sellerOrders = [
    { id: '#1234', items: [{ name: 'Aata 10kg', quantity: 1, price: 1200 }, { name: 'Oil 1L', quantity: 2, price: 450 }], total: 2100, status: 'new', createdAt: '2 min ago', isAnonymous: true, deliveryAddress: 'Hussaini Chowk' },
    { id: '#1235', items: [{ name: 'Rice 5kg', quantity: 1, price: 800 }], total: 800, status: 'preparing', createdAt: '8 min ago', customerName: 'Ahmed', deliveryAddress: 'Yadgar Chowk' },
    { id: '#1236', items: [{ name: 'Sugar 2kg', quantity: 3, price: 320 }], total: 960, status: 'ready', createdAt: '15 min ago', customerName: 'Hussain', deliveryAddress: 'Airport Road' },
];

module.exports = {
    shops, products, orders, users, familyAccounts,
    riderStats, earningsHistory, sellerOrders,
    getNextOrderId: () => `#${++orderCounter}`,
};
