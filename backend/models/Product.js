import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  nameHindi: { type: String, trim: true },
  subtitle: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  category: {
    type: String,
    enum: ['floral', 'woody', 'spicy', 'rare', 'fresh', 'oriental'],
    required: true
  },
  tags: [{ type: String, trim: true }],
  notes: {
    top: [{ type: String, trim: true }],
    heart: [{ type: String, trim: true }],
    base: [{ type: String, trim: true }]
  },
  ingredients: [{ type: String, trim: true }],
  volume: { type: String, default: '12ml' },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  badge: { type: String, enum: ['Bestseller', 'Classic', 'Premium', 'Rare', 'New', 'Limited', ''] },
  colorSwatch: { type: String, default: '#8B6914' },
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 50 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  origin: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

productSchema.index({ category: 1, featured: -1 });
productSchema.index({ name: 'text', subtitle: 'text', tags: 'text' });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
