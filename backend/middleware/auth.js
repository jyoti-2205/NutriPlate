const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role === 'admin') {
      return res.status(403).json({ message: 'Admin token cannot access user routes' });
    }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function adminMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Admin authentication required' });
  }

  try {
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== 'admin' || !payload.adminId) {
      return res.status(403).json({ message: 'Admin access only' });
    }
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired admin token' });
  }
}

module.exports = { authMiddleware, adminMiddleware, JWT_SECRET };
