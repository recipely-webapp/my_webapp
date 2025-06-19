// controllers/recipeController.js
const Recipe = require('../models/Recipe');

exports.searchRecipes = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Parametro di ricerca mancante' });

  try {
    const regex = new RegExp(query, 'i'); // case-insensitive
    const results = await Recipe.find({
      $or: [
        { titolo: regex },
        { descrizione: regex },
        { ingredienti: regex } // modifica se ingredienti è un array di oggetti
      ]
    });
    res.json(results);
  } catch (err) {
    console.error('Errore nella ricerca:', err);
    res.status(500).json({ error: 'Errore nella ricerca delle ricette' });
  }
};
// GET - tutte le ricette
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero delle ricette' });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id); // 'id' deve corrispondere al parametro nella rotta

    if (!recipe) {
      return res.status(404).json({ message: 'Ricetta non trovata' });
    }

    res.status(200).json(recipe);
  } catch (err) {
    console.error('Errore nel recupero della ricetta:', err);
    // Se l'ID non è in un formato valido, Mongoose potrebbe lanciare un errore
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'ID della ricetta non valido' });
    }
    res.status(500).json({ message: 'Errore del server' });
  }
};

exports.getUserRecipes = async (req, res) => {
  try {
    // Troviamo tutte le ricette dove il campo 'autore' corrisponde all'ID dell'utente loggato
    const userRecipes = await Recipe.find({ autore: req.user.userId });
    res.json(userRecipes);
  } catch (err) {
    console.error("Errore nel recupero delle ricette dell'utente:", err);
    res.status(500).json({ error: 'Errore nel recupero delle ricette create dall\'utente' });
  }
};

// POST - crea ricetta
exports.createRecipe = async (req, res) => {
  try {
    // L'ID dell'utente ci viene fornito dal middleware verifyToken (in req.user)
    const autoreId = req.user.userId;

    // Aggiungiamo l'ID dell'autore ai dati della ricetta provenienti dal body
    const recipeData = { 
      ...req.body, 
      autore: autoreId 
    };

    const newRecipe = new Recipe(recipeData);
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    console.error("Errore creazione ricetta:", err);
    // Fornisce un messaggio di errore più specifico in caso di validazione
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(400).json({ error: 'Errore nella creazione della ricetta' });
  }
};
exports.updateRecipe = async (req, res) => {
  try {
    // Non serve più controllare il proprietario, lo fa già il middleware!
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedRecipe) return res.status(404).json({ error: 'Ricetta non trovata' }); // Questo controllo può rimanere per sicurezza
    res.json(updatedRecipe);
  } catch (err) {
    res.status(400).json({ error: 'Errore nell\'aggiornamento della ricetta' });
  }
};

// DELETE - elimina ricetta (ORA È PIÙ SEMPLICE)
exports.deleteRecipe = async (req, res) => {
  try {
    // Non serve più controllare il proprietario, lo fa già il middleware!
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Ricetta non trovata' }); // Anche questo
    res.json({ message: 'Ricetta eliminata con successo' });
  } catch (err) {
    res.status(500).json({ error: 'Errore nell\'eliminazione della ricetta' });
  }
};
