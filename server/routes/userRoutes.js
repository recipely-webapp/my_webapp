const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

// Aggiunge o rimuove dai preferiti
router.post('/favorites/:recipeId',verifyToken,  userController.toggleFavorite);
router.get('/favorites', verifyToken, userController.getFavorites);

module.exports = router;
