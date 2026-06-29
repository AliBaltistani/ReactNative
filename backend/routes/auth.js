/**
 * RasaanGo — Auth Routes
 */
const express = require('express');
const router = express.Router();
const db = require('../data/mockDb');

// POST /api/auth/register
router.post('/register', (req, res) => {
    const { name, phone, role = 'customer' } = req.body;
    if (!name || !phone) return res.status(400).json({ message: 'Name and phone required' });

    const user = { id: `u${Date.now()}`, name, phone, role };
    db.users.push(user);
    const token = `mock-token-${user.id}`;
    res.json({ token, user });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone required' });
    res.json({ message: 'OTP sent', otpSent: true });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP required' });
    // Mock: any 4-digit OTP works
    if (otp.length !== 4) return res.status(400).json({ message: 'Invalid OTP' });

    let user = db.users.find(u => u.phone === phone);
    if (!user) { user = { id: `u${Date.now()}`, name: 'User', phone, role: 'customer' }; db.users.push(user); }
    res.json({ token: `mock-token-${user.id}`, user });
});

// POST /api/auth/family/create
router.post('/family/create', (req, res) => {
    const { headName, headPhone, members = [] } = req.body;
    if (!headName || !headPhone) return res.status(400).json({ message: 'Head name and phone required' });

    const family = {
        id: `f${Date.now()}`, headName, headPhone,
        members: members.map((m, i) => ({ id: `fm${Date.now()}_${i}`, ...m })),
        createdAt: new Date().toISOString(),
    };
    db.familyAccounts.push(family);
    const user = { id: `u${Date.now()}`, name: headName, phone: headPhone, role: 'customer' };
    db.users.push(user);
    res.json({ token: `mock-token-${user.id}`, user, familyId: family.id });
});

// POST /api/auth/family/login
router.post('/family/login', (req, res) => {
    const { familyId, pin } = req.body;
    const family = db.familyAccounts.find(f => f.id === familyId);
    if (!family) return res.status(404).json({ message: 'Family not found' });

    const member = family.members.find(m => m.pin === pin);
    if (!member) return res.status(401).json({ message: 'Invalid PIN' });

    res.json({ token: `mock-token-${member.id}`, user: { id: member.id, name: member.name, role: member.role } });
});

module.exports = router;
