/**
 * RasaanGo — Express Backend Server
 * 
 * Run: cd backend && npm install && node server.js
 * API Base: http://localhost:3001/api
 */
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/rider', require('./routes/rider'));
app.use('/api/seller', require('./routes/seller'));

// Product search (separate from shops)
app.get('/api/products/search', (req, res) => {
    const db = require('./data/mockDb');
    const { q } = req.query;
    if (!q) return res.json([]);
    const results = db.products.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) || (p.nameUr && p.nameUr.includes(q))
    );
    res.json(results);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        app: 'RasaanGo API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 RasaanGo API Server running on http://localhost:${PORT}`);
    console.log(`📋 Available routes:`);
    console.log(`   POST   /api/auth/register`);
    console.log(`   POST   /api/auth/login`);
    console.log(`   POST   /api/auth/verify-otp`);
    console.log(`   POST   /api/auth/family/create`);
    console.log(`   POST   /api/auth/family/login`);
    console.log(`   GET    /api/shops`);
    console.log(`   GET    /api/shops/:id`);
    console.log(`   GET    /api/shops/:id/products`);
    console.log(`   POST   /api/orders`);
    console.log(`   GET    /api/orders`);
    console.log(`   GET    /api/orders/:id`);
    console.log(`   PATCH  /api/orders/:id/status`);
    console.log(`   GET    /api/products/search?q=`);
    console.log(`   POST   /api/rider/status`);
    console.log(`   GET    /api/rider/orders/pending`);
    console.log(`   POST   /api/rider/orders/:id/accept`);
    console.log(`   GET    /api/rider/earnings`);
    console.log(`   GET    /api/seller/dashboard`);
    console.log(`   GET    /api/seller/products`);
    console.log(`   POST   /api/seller/products`);
    console.log(`   PUT    /api/seller/products/:id`);
    console.log(`   DELETE /api/seller/products/:id`);
    console.log(`   GET    /api/seller/orders`);
    console.log(`   PATCH  /api/seller/orders/:id/status`);
    console.log(`   GET    /api/health\n`);
});
