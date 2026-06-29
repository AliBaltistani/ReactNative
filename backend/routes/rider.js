/**
 * RasaanGo — Rider Routes
 */
const express = require('express');
const router = express.Router();
const db = require('../data/mockDb');

let riderOnline = false;

// POST /api/rider/status
router.post('/status', (req, res) => {
    riderOnline = !!req.body.online;
    res.json({ status: riderOnline ? 'online' : 'offline' });
});

// GET /api/rider/orders/pending
router.get('/orders/pending', (req, res) => {
    res.json([{
        id: 'd1', shopName: "Abdul's Karyana", shopAddress: 'Main Bazaar, Skardu',
        deliveryAddress: 'Hussaini Chowk', deliveryLandmark: 'Green gate ke paas',
        itemCount: 3, distance: '2.5 km', earnings: 70, timeLeft: 30,
    }]);
});

// POST /api/rider/orders/:id/accept
router.post('/orders/:id/accept', (req, res) => {
    res.json({
        id: `rd${Date.now()}`, orderId: req.params.id,
        shopName: "Abdul's Karyana", shopAddress: 'Main Bazaar, Skardu',
        deliveryAddress: 'Hussaini Chowk', deliveryLandmark: 'Green gate ke paas',
        itemCount: 3, isAnonymous: true, status: 'heading_to_shop',
        earnings: 70, distance: '2.5 km',
    });
});

// PATCH /api/rider/orders/:id/status
router.patch('/orders/:id/status', (req, res) => {
    const { status } = req.body;
    res.json({ id: req.params.id, status });
});

// GET /api/rider/earnings
router.get('/earnings', (req, res) => {
    res.json({ stats: db.riderStats, history: db.earningsHistory });
});

module.exports = router;
