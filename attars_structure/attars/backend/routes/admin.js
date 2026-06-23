import express from 'express';
import mongoose from 'mongoose';
import AdminSettings from '../models/AdminSettings.js';
import { getAdminCredentials, saveAdminCredentials } from '../utils/settingsHelper.js';

const router = express.Router();

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  let creds;
  if (mongoose.connection.readyState !== 1) {
    creds = getAdminCredentials();
  } else {
    creds = await AdminSettings.findOne() || { username: 'admin', password: 'password' };
  }

  if (username === creds.username && password === creds.password) {
    return res.json({ success: true, message: 'Authenticated successfully', secretKey: 'attars-admin-2026' });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// GET /api/admin/credentials
router.get('/credentials', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== 'attars-admin-2026') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  let creds;
  if (mongoose.connection.readyState !== 1) {
    creds = getAdminCredentials();
  } else {
    creds = await AdminSettings.findOne() || { username: 'admin', password: 'password' };
  }

  res.json({ success: true, username: creds.username });
});

// PUT /api/admin/credentials
router.put('/credentials', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== 'attars-admin-2026') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  if (mongoose.connection.readyState !== 1) {
    saveAdminCredentials(username, password);
  } else {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings({ username, password });
    } else {
      settings.username = username;
      settings.password = password;
    }
    await settings.save();
  }

  res.json({ success: true, message: 'Credentials updated successfully' });
});

// Store reset code in-memory temporarily
let activeResetKey = '';

// POST /api/admin/forgot-password
router.post('/forgot-password', async (req, res, next) => {
  try {
    const resetKey = Math.floor(100000 + Math.random() * 900000).toString();
    activeResetKey = resetKey;

    // Send reset key email
    const { sendResetKeyEmail } = await import('../utils/mailer.js');
    await sendResetKeyEmail('parthgelani08@gmail.com', resetKey);

    res.json({ success: true, message: 'Security reset key sent to parthgelani08@gmail.com' });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/reset-password
router.post('/reset-password', async (req, res, next) => {
  try {
    const { key, username, password } = req.body;
    if (!key || !username || !password) {
      return res.status(400).json({ success: false, message: 'Key, username, and password are required' });
    }

    if (key.trim() !== activeResetKey) {
      return res.status(400).json({ success: false, message: 'Invalid verification key' });
    }

    // Key is verified. Save new credentials
    if (mongoose.connection.readyState !== 1) {
      saveAdminCredentials(username, password);
    } else {
      let settings = await AdminSettings.findOne();
      if (!settings) {
        settings = new AdminSettings({ username, password });
      } else {
        settings.username = username;
        settings.password = password;
      }
      await settings.save();
    }

    // Clear reset key
    activeResetKey = '';

    res.json({ success: true, message: 'Credentials reset successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
