const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) { return res.status(401).json({ message: 'No token, authorization denied.' }); }

  try {
    const token = authHeader.split(' ')[1];
    if (!token) { return res.status(401).json({ message: 'Token format is invalid.' }); }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // --- DEBUG STEP 2 ---
    console.log('--- Step 2: Verifying Token in Middleware ---');
    console.log('Payload coming OUT of token:', decoded);
    // --------------------

    req.user = decoded;
    next(); 
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

module.exports = authMiddleware;

