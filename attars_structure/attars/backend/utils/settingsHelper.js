import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const settingsFilePath = path.join(__dirname, '../config/admin_settings.json');

// Helper to load settings
export const getAdminCredentials = () => {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const data = fs.readFileSync(settingsFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading admin settings file:', err);
  }
  return { username: 'admin', password: 'password', secretKey: 'attars-admin-2026' };
};

// Helper to save settings
export const saveAdminCredentials = (username, password) => {
  try {
    const dirPath = path.dirname(settingsFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(settingsFilePath, JSON.stringify({ username, password, secretKey: 'attars-admin-2026' }, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing admin settings file:', err);
    return false;
  }
};
