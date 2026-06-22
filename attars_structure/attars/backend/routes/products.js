import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { mockProducts } from '../config/mockData.js';

const router = express.Router();

// GET /api/products — all products with optional filters
router.get('/', async (req, res, next) => {
  try {
    const SECRET_KEY = 'attars-admin-2026';
    const isAdmin = (req.headers['x-admin-key'] === SECRET_KEY) || (req.query.key === SECRET_KEY);

    if (mongoose.connection.readyState !== 1) {
      // In-memory fallback
      const { category, featured, sort, search, page = 1, limit = 12 } = req.query;
      let data = mockProducts.map((p, index) => ({ ...p, _id: p._id || `mock-prod-${index + 1}` }));

      // Filter out products without images for storefront queries
      if (!isAdmin) {
        data = data.filter(p => p.image && p.image.trim() !== "");
      }

      if (category && category !== 'all') {
        data = data.filter(p => p.category === category);
      }
      if (featured === 'true') {
        data = data.filter(p => p.featured === true);
      }
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        data = data.filter(p => 
          searchRegex.test(p.name) || 
          searchRegex.test(p.subtitle) || 
          (p.tags && p.tags.some(t => searchRegex.test(t)))
        );
      }

      if (sort === 'price-low') data.sort((a, b) => a.price - b.price);
      else if (sort === 'price-high') data.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') data.sort((a, b) => b.rating - a.rating);

      const total = data.length;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const paginatedData = data.slice(skip, skip + parseInt(limit));

      return res.json({
        success: true,
        data: paginatedData,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    }

    // Standard MongoDB Mongoose query
    const { category, featured, sort, search, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (!isAdmin) {
      filter.image = { $exists: true, $ne: "" };
    }

    if (category && category !== 'all') filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$text = { $search: search };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find(filter).sort(sortOption).skip(skip).limit(parseInt(limit));
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) { next(err); }
});

// GET /api/products/categories — unique categories
router.get('/categories', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const categories = [...new Set(mockProducts.map(p => p.category))];
      return res.json({ success: true, data: categories });
    }
    const categories = await Product.distinct('category');
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const mapped = mockProducts.map((p, i) => ({ ...p, _id: p._id || `mock-prod-${i + 1}` }));
      const product = mapped.find(p => p._id === req.params.id || p.name.replace(/\s+/g, '-').toLowerCase() === req.params.id) || mapped[0];
      return res.json({ success: true, data: product });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
});

// POST /api/products — create product
router.post('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const product = { ...req.body, _id: `mock-prod-${Date.now()}` };
      mockProducts.push(product);
      return res.status(201).json({ success: true, data: product });
    }
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) { next(err); }
});

// PUT /api/products/:id
router.put('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = mockProducts.findIndex(p => p._id === req.params.id || `mock-prod-${mockProducts.indexOf(p) + 1}` === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });
      mockProducts[idx] = { ...mockProducts[idx], ...req.body };
      return res.json({ success: true, data: mockProducts[idx] });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = mockProducts.findIndex(p => p._id === req.params.id || `mock-prod-${mockProducts.indexOf(p) + 1}` === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });
      mockProducts.splice(idx, 1);
      return res.json({ success: true, message: 'Product deleted' });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) { next(err); }
});

export default router;
