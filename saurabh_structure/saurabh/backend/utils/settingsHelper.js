import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const settingsFilePath = path.join(__dirname, '../config/admin_settings.json');

/**
 * Load admin credentials from JSON file (in-memory fallback when MongoDB is unavailable).
 * Returns { username, passwordHash } — never plain-text passwords.
 */
export const getAdminCredentials = () => {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const data = fs.readFileSync(settingsFilePath, 'utf8');
      const parsed = JSON.parse(data);
      // Migrate legacy plain-text password field
      return {
        username: parsed.username || 'admin',
        passwordHash: parsed.passwordHash || parsed.password || null,
      };
    }
  } catch (err) {
    console.error('[Settings] Error reading admin settings file:', err.message);
  }
  // Default: null hash — forces password setup on first login attempt
  return { username: 'admin', passwordHash: null };
};

/**
 * Persist admin credentials to JSON file.
 * @param {string} username
 * @param {string} passwordHash - bcrypt hash
 */
export const saveAdminCredentials = (username, passwordHash) => {
  try {
    const dirPath = path.dirname(settingsFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(settingsFilePath, JSON.stringify({ username, passwordHash }, null, 2));
    return true;
  } catch (err) {
    console.error('[Settings] Error writing admin settings file:', err.message);
    return false;
  }
};
