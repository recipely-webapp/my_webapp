// routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const verifyToken = require('../middleware/verifyToken');

// Aggiungi questa PRIMA di `/:id`
router.get('/search', recipeController.searchRecipes);

// CRUD rotte per le ricette
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);

router.put('/:id', recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);

router.post('/', verifyToken, recipeController.createRecipe); 

module.exports = router;