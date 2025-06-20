
const express = require('express');
const router = express.Router();
// Importa funzioni del controller (logica di business)
const recipeController = require('../controllers/recipeController');
// Middleware per autenticazione e autorizzazione
const {verifyToken} = require('../middleware/verifyToken');
const { isOwnerRecipe } = require('../middleware/isOwnerRecipe');

// Rotte per operazioni pubbliche di ricerca e recupero ricette
router.get('/search', recipeController.searchRecipes);
router.get('/:id', recipeController.getRecipeById);
router.get('/', recipeController.getAllRecipes);

// Rotte per operazioni protette con autenticazione e autorizzazione
router.get('/by-user/mine', verifyToken, recipeController.getUserRecipes);
router.post('/', verifyToken, recipeController.createRecipe); 
router.put('/:id', verifyToken, isOwnerRecipe, recipeController.updateRecipe);
router.delete('/:id', verifyToken, isOwnerRecipe, recipeController.deleteRecipe);


module.exports = router;