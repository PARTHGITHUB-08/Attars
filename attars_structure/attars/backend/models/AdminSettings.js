import mongoose from 'mongoose';

const adminSettingsSchema = new mongoose.Schema({
  username: { type: String, required: true, default: 'admin' },
  password: { type: String, required: true, default: 'password' },
  secretKey: { type: String, default: 'attars-admin-2026' }
});

export default mongoose.model('AdminSettings', adminSettingsSchema);
