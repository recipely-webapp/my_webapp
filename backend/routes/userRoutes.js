
const express = require('express');
const router = express.Router();
// Importa funzioni del controller (logica di business)
const userController = require('../controllers/userController');
// Middleware per autenticazione
const {verifyToken} = require('../middleware/verifyToken');


// Aggiunge o rimuove dai preferiti
router.post('/favorites/:recipeId', verifyToken,  userController.toggleFavorite);
// Recupera la lista dei preferiti
router.get('/favorites', verifyToken, userController.getFavorites); 

module.exports = router;