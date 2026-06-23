import express from 'express';
import mongoose from 'mongoose';
import Invoice from '../models/Invoice.js';
import { sendInvoiceEmail } from '../utils/mailer.js';

const router = express.Router();
const SECRET_KEY = 'attars-admin-2026';

const checkAdminKey = (req, res, next) => {
  const key = req.headers['x-admin-key'] || req.query.key;
  if (key !== SECRET_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

const localInvoices = [];

// GET /api/invoices
router.get('/', checkAdminKey, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: localInvoices });
    }
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (err) { next(err); }
});

// POST /api/invoices
router.post('/', async (req, res, next) => {
  try {
    const { invoiceId, customer, items, subtotal, discount, cgst, sgst, grandTotal, date, paymentMethod, paymentStatus } = req.body;
    
    if (!invoiceId || !customer || !items || !grandTotal) {
      return res.status(400).json({ success: false, message: 'Missing required invoice details' });
    }

    const method = paymentMethod || 'UPI';
    const status = paymentStatus || 'Pending';

    let savedInvoice;
    if (mongoose.connection.readyState !== 1) {
      savedInvoice = {
        _id: `mock-inv-${Date.now()}`,
        invoiceId,
        customer,
        items,
        subtotal,
        discount,
        cgst,
        sgst,
        grandTotal,
        date,
        paymentMethod: method,
        paymentStatus: status,
        createdAt: new Date()
      };
      localInvoices.unshift(savedInvoice);
    } else {
      savedInvoice = await Invoice.create({
        invoiceId,
        customer,
        items,
        subtotal,
        discount,
        cgst,
        sgst,
        grandTotal,
        date,
        paymentMethod: method,
        paymentStatus: status
      });
    }

    // Trigger automated email dispatch immediately ONLY for Cash or already Paid invoices
    const contact = customer.contact || '';
    if (contact.includes('@')) {
      const email = contact.trim().split(/\s+/).find(word => word.includes('@'));
      if (email) {
        if (method === 'Cash' || status === 'Paid') {
          sendInvoiceEmail(email, customer.name, invoiceId, items, grandTotal, date, method, status).catch(err => {
            console.error('[Mailer Error] Failed to send automated invoice email:', err);
          });
        }
      }
    }

    res.status(201).json({ success: true, data: savedInvoice });
  } catch (err) {
    next(err);
  }
});

// PUT /api/invoices/:id/mark-paid
router.put('/:id/mark-paid', checkAdminKey, async (req, res, next) => {
  try {
    const { id } = req.params;
    let invoice;
    if (mongoose.connection.readyState !== 1) {
      invoice = localInvoices.find(inv => inv.invoiceId === id || inv._id === id);
      if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
      invoice.paymentStatus = 'Paid';
    } else {
      invoice = await Invoice.findById(id);
      if (!invoice) {
        invoice = await Invoice.findOne({ invoiceId: id });
      }
      if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
      invoice.paymentStatus = 'Paid';
      await invoice.save();
    }

    // Trigger email now that payment is confirmed
    const contact = invoice.customer.contact || '';
    if (contact.includes('@')) {
      const email = contact.trim().split(/\s+/).find(word => word.includes('@'));
      if (email) {
        sendInvoiceEmail(email, invoice.customer.name, invoice.invoiceId, invoice.items, invoice.grandTotal, invoice.date, invoice.paymentMethod, 'Paid').catch(err => {
          console.error('[Mailer Error] Failed to send invoice email after payment verification:', err);
        });
      }
    }

    res.json({ success: true, message: 'Invoice marked as paid and sent to customer', data: invoice });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/invoices/:id
router.delete('/:id', checkAdminKey, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const idx = localInvoices.findIndex(inv => inv.invoiceId === id || inv._id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Invoice not found' });
      localInvoices.splice(idx, 1);
      return res.json({ success: true, message: 'Invoice deleted successfully' });
    }
    
    let invoice = await Invoice.findByIdAndDelete(id);
    if (!invoice) {
      invoice = await Invoice.findOneAndDelete({ invoiceId: id });
    }
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (err) { next(err); }
});

export default router;
