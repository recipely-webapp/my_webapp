// server/routes/recipeRoutes.js

const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const verifyToken = require('../middleware/verifyToken');
const { isOwnerRecipe } = require('../middleware/isOwnerRecipe');

// --- ORDINE DELLE ROTTE CORRETTO ---
// Le rotte vengono controllate dall'alto verso il basso.
// 1. Prima le rotte "statiche" e più specifiche.
// 2. Poi le rotte più "generiche".
// 3. Per ultime le rotte "dinamiche" con parametri (es. /:id).

// --- 1. ROTTE SPECIFICHE (STATICHE) ---
// Queste non hanno parametri e devono essere intercettate prima di quelle dinamiche.
// '/search' deve venire prima di '/:id' altrimenti "search" verrebbe trattato come un ID.
router.get('/search', recipeController.searchRecipes);

// '/by-user/mine' è un'altra rotta specifica che deve venire prima di '/:id'.
router.get('/by-user/mine', verifyToken, recipeController.getUserRecipes);


// --- 2. ROTTE GENERICHE SULLA RADICE ('/') ---
// Queste si applicano al percorso base '/api/recipes'.
router.get('/', recipeController.getAllRecipes);
router.post('/', verifyToken, recipeController.createRecipe); 


// --- 3. ROTTE DINAMICHE (CON PARAMETRI) ---
// Queste sono le più "avide" e devono stare per ultime.
// '/:id' catturerà qualsiasi cosa che non è stata abbinata prima (es. /12345, /abcde).
router.get('/:id', recipeController.getRecipeById);
router.put('/:id', verifyToken, isOwnerRecipe, recipeController.updateRecipe);
router.delete('/:id', verifyToken, isOwnerRecipe, recipeController.deleteRecipe);


module.exports = router;