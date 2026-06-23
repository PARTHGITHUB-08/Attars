import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    notes: { type: String, default: '' },
    date: { type: String, required: true }
  },
  items: [{
    _id: String,
    name: { type: String, required: true },
    nameHindi: String,
    price: { type: Number, required: true },
    volume: String,
    qty: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  cgst: { type: Number, required: true },
  sgst: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['UPI', 'Cash'], default: 'UPI' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Invoice', invoiceSchema);
