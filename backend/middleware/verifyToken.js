// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Estrae il token da "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Accesso negato. Token mancante.' });
  }

  try {
    // Verifica il token e mette il payload (es. { userId: '...' }) in req.user
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // Se il token è scaduto o non valido, restituisce un errore
    res.status(403).json({ error: 'Token non valido.' });
  }
};