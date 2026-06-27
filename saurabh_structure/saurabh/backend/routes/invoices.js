import express from 'express';
import mongoose from 'mongoose';
import Invoice from '../models/Invoice.js';
import { requireAuth } from '../middleware/auth.js';
import { sendInvoiceEmail } from '../utils/mailer.js';

const router = express.Router();

// In-memory fallback when MongoDB is unavailable
const localInvoices = [];

// GET /api/invoices (admin only)
router.get('/', requireAuth, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: localInvoices });
    }
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (err) {
    next(err);
  }
});

// POST /api/invoices — create or update invoice (admin only)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { invoiceId, customer, items, subtotal, discount, cgst, sgst, grandTotal, date, paymentMethod, paymentStatus } = req.body;

    if (!invoiceId || !customer || !items || !grandTotal) {
      return res.status(400).json({ success: false, message: 'Missing required invoice details' });
    }

    const method = paymentMethod || 'Cash';
    const status = paymentStatus || 'Pending';

    let savedInvoice;
    if (mongoose.connection.readyState !== 1) {
      const idx = localInvoices.findIndex(inv => inv.invoiceId === invoiceId);
      if (idx !== -1) {
        localInvoices[idx] = { ...localInvoices[idx], customer, items, subtotal, discount, cgst, sgst, grandTotal, date, paymentMethod: method, paymentStatus: status };
        savedInvoice = localInvoices[idx];
      } else {
        savedInvoice = { _id: `mock-inv-${Date.now()}`, invoiceId, customer, items, subtotal, discount, cgst, sgst, grandTotal, date, paymentMethod: method, paymentStatus: status, createdAt: new Date() };
        localInvoices.unshift(savedInvoice);
      }
    } else {
      const existing = await Invoice.findOne({ invoiceId });
      if (existing) {
        Object.assign(existing, { customer, items, subtotal, discount, cgst, sgst, grandTotal, date, paymentMethod: method, paymentStatus: status });
        savedInvoice = await existing.save();
      } else {
        savedInvoice = await Invoice.create({ invoiceId, customer, items, subtotal, discount, cgst, sgst, grandTotal, date, paymentMethod: method, paymentStatus: status });
      }
    }

    // Send email for cash payments or already-paid invoices
    const contact = customer.contact || '';
    if (contact.includes('@')) {
      const email = contact.trim().split(/\s+/).find(word => word.includes('@'));
      if (email && (method === 'Cash' || status === 'Paid')) {
        sendInvoiceEmail(email, customer.name, invoiceId, items, grandTotal, date, method, status).catch(err => {
          console.error('[Mailer Error]', err.message);
        });
      }
    }

    res.status(201).json({ success: true, data: savedInvoice });
  } catch (err) {
    next(err);
  }
});

// GET /api/invoices/:id — public tracking (by invoiceId string)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let invoice;
    if (mongoose.connection.readyState !== 1) {
      invoice = localInvoices.find(inv => inv.invoiceId === id || inv._id === id);
    } else {
      invoice = await Invoice.findById(id).catch(() => null);
      if (!invoice) invoice = await Invoice.findOne({ invoiceId: id });
    }
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Order/Invoice not found' });
    }
    res.json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
});

// PUT /api/invoices/:id/mark-paid (admin only)
router.put('/:id/mark-paid', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    let invoice;
    if (mongoose.connection.readyState !== 1) {
      invoice = localInvoices.find(inv => inv.invoiceId === id || inv._id === id);
      if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
      invoice.paymentStatus = 'Paid';
    } else {
      invoice = await Invoice.findById(id).catch(() => null);
      if (!invoice) invoice = await Invoice.findOne({ invoiceId: id });
      if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
      invoice.paymentStatus = 'Paid';
      await invoice.save();
    }

    const contact = invoice.customer.contact || '';
    if (contact.includes('@')) {
      const email = contact.trim().split(/\s+/).find(word => word.includes('@'));
      if (email) {
        sendInvoiceEmail(email, invoice.customer.name, invoice.invoiceId, invoice.items, invoice.grandTotal, invoice.date, invoice.paymentMethod, 'Paid').catch(err => {
          console.error('[Mailer Error]', err.message);
        });
      }
    }

    res.json({ success: true, message: 'Invoice marked as paid', data: invoice });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/invoices/:id (admin only)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const idx = localInvoices.findIndex(inv => inv.invoiceId === id || inv._id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Invoice not found' });
      localInvoices.splice(idx, 1);
      return res.json({ success: true, message: 'Invoice deleted successfully' });
    }
    let invoice = await Invoice.findByIdAndDelete(id).catch(() => null);
    if (!invoice) invoice = await Invoice.findOneAndDelete({ invoiceId: id });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
