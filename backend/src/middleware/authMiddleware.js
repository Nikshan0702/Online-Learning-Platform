const jwt = require('jsonwebtoken');

// Middleware to authenticate user using JWT Bearer token
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1 & 2. Check and extract Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4 & 5. Add user ID and role to the request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    // 6. Allow the request to continue
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
