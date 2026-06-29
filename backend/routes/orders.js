/**
 * RasaanGo — Order Routes
 */
const express = require('express');
const router = express.Router();
const db = require('../data/mockDb');

// POST /api/orders
router.post('/', (req, res) => {
    const { shopId, items, deliveryAddress, landmark, isAnonymous, leaveAtDoor, paymentMethod } = req.body;
    if (!shopId || !items?.length || !deliveryAddress) {
        return res.status(400).json({ message: 'shopId, items, and deliveryAddress required' });
    }

    const shop = db.shops.find(s => s.id === shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    const orderItems = items.map(i => {
        const product = db.products.find(p => p.id === i.productId);
        return { product: product || { id: i.productId, name: 'Unknown' }, quantity: i.quantity };
    });

    const total = orderItems.reduce((sum, i) => sum + ((i.product.price || 0) * i.quantity), 0);
    const deliveryFee = 60;

    const order = {
        id: db.getNextOrderId(),
        items: orderItems, shop, status: 'confirmed', total, deliveryFee,
        deliveryAddress, landmark: landmark || '', isAnonymous: !!isAnonymous,
        leaveAtDoor: !!leaveAtDoor, paymentMethod: paymentMethod || 'cash',
        createdAt: new Date().toISOString(),
    };

    db.orders.push(order);
    res.status(201).json(order);
});

// GET /api/orders
router.get('/', (req, res) => {
    res.json(db.orders);
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', (req, res) => {
    const { status } = req.body;
    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    res.json(order);
});

// POST /api/orders/:id/rate
router.post('/:id/rate', (req, res) => {
    const { rating } = req.body;
    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.rating = rating;
    res.json({ success: true });
});

// GET /api/products/search
router.get('/products/search', (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);
    const results = db.products.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) || p.nameUr.includes(q)
    );
    res.json(results);
});

module.exports = router;
