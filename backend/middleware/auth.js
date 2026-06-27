import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'saurabh-super-secret-jwt-key-change-in-production';

/**
 * Middleware: verify JWT from HTTP-only cookie or Authorization header.
 * Sets req.adminId on success.
 */
export function requireAuth(req, res, next) {
  try {
    const token =
      req.cookies?.saurabh_admin_token ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : null);

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired session' });
  }
}

/**
 * Generate a signed JWT for the admin session
 * @param {string} id - AdminSettings document _id or a stable identifier
 * @returns {string} signed JWT
 */
export function generateToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '8h' });
}
