const express = require('express');
const router = express.Router();
// Importa le funzioni del controller (logica di business)
const authController = require('../controllers/authController');

// Rotte per autenticazione
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/refresh', authController.refreshToken);

module.exports = router;
