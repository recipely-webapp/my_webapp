// server/middleware/checkOwnership.js

const Recipe = require('../models/Recipe'); // Dobbiamo usare il modello Recipe per trovare la ricetta

// Esportiamo una funzione middleware chiamata isRecipeOwner
exports.isOwnerRecipe= async (req, res, next) => {
  try {
    // 1. Trova la ricetta usando l'ID che arriva dai parametri dell'URL (es. /api/recipes/ID_RICETTA)
    const recipe = await Recipe.findById(req.params.id);

    // 2. Se la ricetta non esiste, restituisci un errore 404 (Not Found)
    if (!recipe) {
      return res.status(404).json({ message: 'Ricetta non trovata' });
    }

    // 3. Controlla se l'autore della ricetta è lo stesso utente che ha fatto la richiesta.
    //    'recipe.autore' è l'ObjectId salvato nel DB.
    //    'req.user.userId' è l'ID che il middleware 'verifyToken' ha messo nella richiesta.
    //    Usiamo .toString() per confrontare le stringhe e non gli oggetti.
    if (recipe.autore.toString() !== req.user.userId) {
      // Se non è l'autore, restituisci un errore 403 (Forbidden - Proibito)
      return res.status(403).json({ message: 'Azione non autorizzata. Non sei l\'autore della ricetta.' });
    }

    // 4. Se tutti i controlli passano, l'utente è il proprietario.
    //    Chiama next() per passare al prossimo middleware nella catena (che sarà il controller).
    next();

  } catch (err) {
    // Se c'è un errore generico (es. ID non valido), restituisci un errore 500
    console.error("Errore nel middleware checkOwnership:", err);
    res.status(500).json({ message: 'Errore del server durante il controllo dei permessi' });
  }
};