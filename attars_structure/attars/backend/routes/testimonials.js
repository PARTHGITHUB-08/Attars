import express from 'express';
import mongoose from 'mongoose';
import Testimonial from '../models/Testimonial.js';
import { mockTestimonials } from '../config/mockData.js';

const router = express.Router();
const SECRET_KEY = 'attars-admin-2026';

const localTestimonials = mockTestimonials.map((t, index) => ({
  ...t,
  _id: t._id || `mock-test-${index + 1}`
}));

// Admin middleware key validator
const checkAdminKey = (req, res, next) => {
  const key = req.headers['x-admin-key'] || req.query.key;
  if (key !== SECRET_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid Secret Key' });
  }
  next();
};

// GET /api/testimonials — fetch approved testimonials
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: localTestimonials.filter(t => t.approved !== false).slice(0, 20) });
    }
    const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: testimonials });
  } catch (err) { next(err); }
});

// GET /api/testimonials/admin — fetch all testimonials for admin
router.get('/admin', checkAdminKey, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: localTestimonials });
    }
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (err) { next(err); }
});

// POST /api/testimonials — submit testimonial (defaults to unapproved)
router.post('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const newTestimonial = {
        ...req.body,
        _id: `mock-test-${Date.now()}`,
        approved: false,
        createdAt: new Date(),
        initials: (req.body.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      };
      localTestimonials.unshift(newTestimonial);
      return res.status(201).json({ success: true, message: 'Testimonial submitted for review' });
    }
    const testimonial = await Testimonial.create({ ...req.body, approved: false });
    res.status(201).json({ success: true, message: 'Testimonial submitted for review' });
  } catch (err) { next(err); }
});

// PUT /api/testimonials/:id — update testimonial status (e.g. toggle approval)
router.put('/:id', checkAdminKey, async (req, res, next) => {
  try {
    const { approved } = req.body;
    if (mongoose.connection.readyState !== 1) {
      const idx = localTestimonials.findIndex(t => t._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Testimonial not found' });
      localTestimonials[idx].approved = approved;
      return res.json({ success: true, data: localTestimonials[idx] });
    }
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { approved }, { new: true });
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, data: testimonial });
  } catch (err) { next(err); }
});

// DELETE /api/testimonials/:id — delete testimonial record
router.delete('/:id', checkAdminKey, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = localTestimonials.findIndex(t => t._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Testimonial not found' });
      localTestimonials.splice(idx, 1);
      return res.json({ success: true, message: 'Testimonial deleted' });
    }
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (err) { next(err); }
});

export default router;
