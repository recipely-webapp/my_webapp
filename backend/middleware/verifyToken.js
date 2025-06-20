const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Estrazione del token dopo Bearer
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Accesso negato. Token mancante.' });
  }

  try {
    // Verifica e decodifica del token usando la chiave segreta
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } 
  
  catch (err) {
    res.status(403).json({ error: 'Token non valido.' });
  }
};

    