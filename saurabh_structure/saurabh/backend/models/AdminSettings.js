import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSettingsSchema = new mongoose.Schema({
  username: { type: String, required: true, default: 'admin' },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

/**
 * Compare plain password against stored hash
 * @param {string} plainPassword
 * @returns {Promise<boolean>}
 */
adminSettingsSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

export default mongoose.model('AdminSettings', adminSettingsSchema);
