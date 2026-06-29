/**
 * RasaanGo — Shop Routes
 */
const express = require('express');
const router = express.Router();
const db = require('../data/mockDb');

// GET /api/shops
router.get('/', (req, res) => {
    const { category } = req.query;
    let result = db.shops;
    if (category) result = result.filter(s => s.category === category);
    res.json(result);
});

// GET /api/shops/:id
router.get('/:id', (req, res) => {
    const shop = db.shops.find(s => s.id === req.params.id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    res.json(shop);
});

// GET /api/shops/:id/products
router.get('/:id/products', (req, res) => {
    const products = db.products.filter(p => p.shopId === req.params.id);
    res.json(products);
});

module.exports = router;
