const Recipe = require('../models/Recipe');
// Rende disponibile la funzione ad altri file
exports.isOwnerRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Ricetta non trovata' });
    }

    if (recipe.autore.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Non sei il proprietario.' });
    }
    next();

  } catch (err) {
    console.error("Errore:", err);
    res.status(500).json({ message: 'Errore del server' });
  }
};