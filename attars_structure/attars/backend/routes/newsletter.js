import express from 'express';
import mongoose from 'mongoose';
import Subscriber from '../models/Subscriber.js';

const router = express.Router();
const SECRET_KEY = 'attars-admin-2026';

const localSubscribers = [
  { _id: 'mock-sub-1', email: 'royal.collector@attars.in', subscribedAt: new Date(Date.now() - 86400000 * 2), active: true },
  { _id: 'mock-sub-2', email: 'monsoon.lover@gmail.com', subscribedAt: new Date(Date.now() - 86400000), active: true }
];

// Admin key check middleware
const checkAdminKey = (req, res, next) => {
  const key = req.headers['x-admin-key'] || req.query.key;
  if (key !== SECRET_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid Secret Key' });
  }
  next();
};

// POST /api/newsletter/subscribe — subscribe email
router.post('/subscribe', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    if (mongoose.connection.readyState !== 1) {
      const emailKey = email.trim().toLowerCase();
      const existing = localSubscribers.find(s => s.email === emailKey);
      if (existing) {
        if (existing.active) return res.json({ success: true, message: 'You are already subscribed!' });
        existing.active = true;
        return res.json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
      }
      localSubscribers.push({
        _id: `mock-sub-${Date.now()}`,
        email: emailKey,
        subscribedAt: new Date(),
        active: true
      });
      return res.status(201).json({ success: true, message: 'Welcome to the fragrance family! Check your email for 10% off.' });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (existing.active) return res.json({ success: true, message: 'You are already subscribed!' });
      existing.active = true;
      await existing.save();
      return res.json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
    }

    await Subscriber.create({ email });
    res.status(201).json({ success: true, message: 'Welcome to the fragrance family! Check your email for 10% off.' });
  } catch (err) {
    if (err.code === 11000) return res.json({ success: true, message: 'You are already subscribed!' });
    next(err);
  }
});

// GET /api/newsletter/subscribers — retrieve all subscribers list (Admin only)
router.get('/subscribers', checkAdminKey, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: localSubscribers });
    }
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.json({ success: true, data: subscribers });
  } catch (err) { next(err); }
});

// DELETE /api/newsletter/subscribers/:id — unsubscribe/delete record (Admin only)
router.delete('/subscribers/:id', checkAdminKey, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = localSubscribers.findIndex(s => s._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Subscriber not found' });
      localSubscribers.splice(idx, 1);
      return res.json({ success: true, message: 'Subscriber deleted' });
    }
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) return res.status(404).json({ success: false, message: 'Subscriber not found' });
    res.json({ success: true, message: 'Subscriber deleted' });
  } catch (err) { next(err); }
});

export default router;
