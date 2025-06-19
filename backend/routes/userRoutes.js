// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

// Aggiunge o rimuove dai preferiti
router.post('/favorites/:recipeId', verifyToken,  userController.toggleFavorite);
router.get('/favorites', verifyToken, userController.getFavorites); // Questa è specifica e non ha conflitti con l'altra. L'ordine qui è OK.

module.exports = router;