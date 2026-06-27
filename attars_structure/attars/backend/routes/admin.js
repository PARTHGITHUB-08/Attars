import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import AdminSettings from '../models/AdminSettings.js';
import Product from '../models/Product.js';
import Testimonial from '../models/Testimonial.js';
import Subscriber from '../models/Subscriber.js';
import Invoice from '../models/Invoice.js';
import { requireAuth, generateToken } from '../middleware/auth.js';
import { getAdminCredentials, saveAdminCredentials } from '../utils/settingsHelper.js';
import { mockProducts, mockTestimonials } from '../config/mockData.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
});

const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 5,
  message: { success: false, message: 'Too many reset attempts. Please try again in an hour.' },
});

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 8 * 60 * 60 * 1000,
};

async function getAdmin() {
  if (mongoose.connection.readyState !== 1) return getAdminCredentials();
  let admin = await AdminSettings.findOne();
  if (!admin) {
    const defaultPassword = process.env.ADMIN_PASSWORD || 'Attars@2026!';
    const passwordHash = await bcrypt.hash(defaultPassword, 12);
    admin = await AdminSettings.create({ username: 'admin', passwordHash });
  }
  return admin;
}

// ── POST /api/admin/login ──────────────────────────────────────────────────
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password are required' });
  if (typeof username !== 'string' || typeof password !== 'string') return res.status(400).json({ success: false, message: 'Invalid input' });

  try {
    const admin = await getAdmin();
    const usernameMatch = username.trim() === admin.username;
    const hash = admin.passwordHash || (admin.comparePassword ? null : admin.password);
    const passwordMatch = hash ? await bcrypt.compare(password, hash) : false;

    if (!usernameMatch || !passwordMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = generateToken(admin._id ? admin._id.toString() : 'admin');
    res.cookie('attars_admin_token', token, COOKIE_OPTIONS).json({ success: true, message: 'Authenticated successfully' });
  } catch (err) {
    console.error('[Admin Login]', err.message);
    res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
});

// ── POST /api/admin/logout ─────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('attars_admin_token', { httpOnly: true, sameSite: 'strict' }).json({ success: true, message: 'Logged out' });
});

// ── GET /api/admin/me ──────────────────────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  try {
    const admin = await getAdmin();
    res.json({ success: true, username: admin.username });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ── GET /api/admin/credentials ─────────────────────────────────────────────
router.get('/credentials', requireAuth, async (req, res) => {
  try {
    const admin = await getAdmin();
    res.json({ success: true, username: admin.username });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ── PUT /api/admin/credentials ─────────────────────────────────────────────
router.put('/credentials', requireAuth, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password are required' });
  if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    if (mongoose.connection.readyState !== 1) {
      saveAdminCredentials(username, passwordHash);
    } else {
      let admin = await AdminSettings.findOne();
      if (!admin) admin = new AdminSettings({ username, passwordHash });
      else { admin.username = username; admin.passwordHash = passwordHash; }
      await admin.save();
    }
    const token = generateToken(req.adminId || 'admin');
    res.cookie('attars_admin_token', token, COOKIE_OPTIONS).json({ success: true, message: 'Credentials updated successfully' });
  } catch (err) {
    console.error('[Update Credentials]', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── Forgot / Reset password ────────────────────────────────────────────────
let activeResetKey = '';
let resetKeyExpiry = 0;

router.post('/forgot-password', forgotLimiter, async (req, res, next) => {
  try {
    const resetKey = Math.floor(100000 + Math.random() * 900000).toString();
    activeResetKey = resetKey;
    resetKeyExpiry = Date.now() + 15 * 60 * 1000;
    const { sendResetKeyEmail } = await import('../utils/mailer.js');
    const adminEmail = process.env.ADMIN_EMAIL || 'parthgelani08@gmail.com';
    const sent = await sendResetKeyEmail(adminEmail, resetKey);
    if (sent) return res.json({ success: true, message: `Reset key sent to ${adminEmail}` });
    const isDev = process.env.NODE_ENV !== 'production';
    console.log(`\n${'='.repeat(50)}\n[DEV] RESET KEY: ${resetKey}\n${'='.repeat(50)}\n`);
    res.json({ success: true, message: isDev ? 'Key logged to server console.' : 'Reset key dispatched.', ...(isDev ? { devKey: resetKey } : {}) });
  } catch (err) { next(err); }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { key, username, password } = req.body;
    if (!key || !username || !password) return res.status(400).json({ success: false, message: 'Key, username, and password are required' });
    if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    if (Date.now() > resetKeyExpiry) return res.status(400).json({ success: false, message: 'Reset key has expired. Request a new one.' });
    if (key.trim() !== activeResetKey) return res.status(400).json({ success: false, message: 'Invalid verification key' });
    const passwordHash = await bcrypt.hash(password, 12);
    if (mongoose.connection.readyState !== 1) {
      saveAdminCredentials(username, passwordHash);
    } else {
      let admin = await AdminSettings.findOne();
      if (!admin) admin = new AdminSettings({ username, passwordHash });
      else { admin.username = username; admin.passwordHash = passwordHash; }
      await admin.save();
    }
    activeResetKey = '';
    resetKeyExpiry = 0;
    res.json({ success: true, message: 'Credentials reset successfully' });
  } catch (err) { next(err); }
});

// ── GET /api/admin/dashboard ───────────────────────────────────────────────
router.get('/dashboard', requireAuth, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      // Rich mock data for offline / dev mode
      const categories = [...new Set(mockProducts.map(p => p.category))];
      const catBreakdown = categories.map(c => ({ name: c, count: mockProducts.filter(p => p.category === c).length }));

      const months = [];
      for (let m = 5; m >= 0; m--) {
        const d = new Date(); d.setMonth(d.getMonth() - m);
        const label = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
        months.push({ month: label, revenue: Math.floor(Math.random() * 80000 + 20000), orders: Math.floor(Math.random() * 30 + 5) });
      }

      return res.json({
        success: true,
        data: {
          products: { total: mockProducts.length, inStock: mockProducts.filter(p => p.inStock !== false).length, outOfStock: mockProducts.filter(p => p.inStock === false).length, featured: mockProducts.filter(p => p.featured).length },
          reviews: { total: 0, approved: 0, pending: 0 },
          subscribers: { total: 0, active: 0 },
          invoices: { total: 18, totalRevenue: 284500, paid: 14, pending: 4, monthlyRevenue: months, recentInvoices: [] },
          topProducts: mockProducts.slice(0, 5).map(p => ({ name: p.name, revenue: p.price * Math.floor(Math.random() * 15 + 3), orders: Math.floor(Math.random() * 15 + 3), rating: p.rating || 4.5 })),
          categoryBreakdown: catBreakdown,
          weeklyActivity: [12, 19, 8, 25, 17, 30, 22],
        }
      });
    }

    const [totalProducts, inStockProducts, featuredProducts, totalReviews, approvedReviews, totalSubscribers, activeSubscribers, allInvoices] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ inStock: true }),
      Product.countDocuments({ featured: true }),
      Testimonial.countDocuments(),
      Testimonial.countDocuments({ approved: true }),
      Subscriber.countDocuments(),
      Subscriber.countDocuments({ active: true }),
      Invoice.find().sort({ createdAt: -1 }).lean(),
    ]);

    const paidInvoices = allInvoices.filter(i => i.paymentStatus === 'Paid');
    const totalRevenue = paidInvoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);

    const monthlyRevenue = [];
    for (let m = 5; m >= 0; m--) {
      const d = new Date(); d.setMonth(d.getMonth() - m);
      const label = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      const revenue = paidInvoices
        .filter(i => { const id = new Date(i.createdAt); return id.getMonth() === d.getMonth() && id.getFullYear() === d.getFullYear(); })
        .reduce((s, i) => s + (i.grandTotal || 0), 0);
      const orders = allInvoices.filter(i => { const id = new Date(i.createdAt); return id.getMonth() === d.getMonth() && id.getFullYear() === d.getFullYear(); }).length;
      monthlyRevenue.push({ month: label, revenue, orders });
    }

    const productRevMap = {};
    allInvoices.forEach(inv => (inv.items || []).forEach(item => {
      if (!productRevMap[item.name]) productRevMap[item.name] = { name: item.name, revenue: 0, orders: 0 };
      productRevMap[item.name].revenue += (item.price || 0) * (item.qty || 1);
      productRevMap[item.name].orders += 1;
    }));
    const topProducts = Object.values(productRevMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    const catPipeline = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    const categoryBreakdown = catPipeline.map(c => ({ name: c._id, count: c.count }));

    const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return allInvoices.filter(inv => { const id = new Date(inv.createdAt); return id.toDateString() === d.toDateString(); }).length;
    });

    res.json({
      success: true,
      data: {
        products: { total: totalProducts, inStock: inStockProducts, outOfStock: totalProducts - inStockProducts, featured: featuredProducts },
        reviews: { total: totalReviews, approved: approvedReviews, pending: totalReviews - approvedReviews },
        subscribers: { total: totalSubscribers, active: activeSubscribers },
        invoices: { total: allInvoices.length, totalRevenue, paid: paidInvoices.length, pending: allInvoices.length - paidInvoices.length, monthlyRevenue, recentInvoices: allInvoices.slice(0, 5) },
        topProducts,
        categoryBreakdown,
        weeklyActivity,
      }
    });
  } catch (err) { next(err); }
});

export default router;
