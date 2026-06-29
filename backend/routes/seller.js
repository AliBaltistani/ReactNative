/**
 * RasaanGo — Seller Routes
 */
const express = require('express');
const router = express.Router();
const db = require('../data/mockDb');

let sellerProducts = [
    { id: 'sp1', name: 'Aata 10kg', nameUr: 'آٹا', price: 1200, category: 'Flour', inStock: true, unit: '10kg', image: '' },
    { id: 'sp2', name: 'Rice 5kg', nameUr: 'چاول', price: 800, category: 'Rice', inStock: true, unit: '5kg', image: '' },
    { id: 'sp3', name: 'Cooking Oil 1L', nameUr: 'تیل', price: 450, category: 'Oil', inStock: true, unit: '1L', image: '' },
    { id: 'sp4', name: 'Sugar 2kg', nameUr: 'چینی', price: 320, category: 'Sugar', inStock: true, unit: '2kg', image: '' },
];

// GET /api/seller/dashboard
router.get('/dashboard', (req, res) => {
    res.json({ stats: { todayOrders: 23, todaySales: 4500, rating: 4.8 }, orders: db.sellerOrders });
});

// GET /api/seller/products
router.get('/products', (req, res) => {
    res.json(sellerProducts);
});

// POST /api/seller/products
router.post('/products', (req, res) => {
    const product = { id: `sp${Date.now()}`, ...req.body };
    sellerProducts.push(product);
    res.status(201).json(product);
});

// PUT /api/seller/products/:id
router.put('/products/:id', (req, res) => {
    const idx = sellerProducts.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Product not found' });
    sellerProducts[idx] = { ...sellerProducts[idx], ...req.body };
    res.json(sellerProducts[idx]);
});

// DELETE /api/seller/products/:id
router.delete('/products/:id', (req, res) => {
    const idx = sellerProducts.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Product not found' });
    sellerProducts.splice(idx, 1);
    res.json({ success: true });
});

// GET /api/seller/orders
router.get('/orders', (req, res) => {
    const { status } = req.query;
    let result = db.sellerOrders;
    if (status) result = result.filter(o => o.status === status);
    res.json(result);
});

// PATCH /api/seller/orders/:id/status
router.patch('/orders/:id/status', (req, res) => {
    const order = db.sellerOrders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    res.json(order);
});

module.exports = router;
