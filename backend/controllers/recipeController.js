const Recipe = require('../models/Recipe');

exports.searchRecipes = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Parametro di ricerca mancante' });

  try {
    // Crea una Regular Expression per ricerca case-insensitive
    const regex = new RegExp(query, 'i'); 
    const results = await Recipe.find({
      $or: [
        { titolo: regex },
        { descrizione: regex },
        { ingredienti: regex } 
      ]
    });

    res.json(results);
  } 
  catch (err) {
    console.error('Errore nella ricerca:', err);
    res.status(500).json({ error: 'Errore nella ricerca delle ricette' });
  }
};

// Recupera tutte le ricette
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } 
  catch (err) {
    res.status(500).json({ error: 'Errore nel recupero delle ricette' });
  }
};

// Recupera una ricetta tramite ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Ricetta non trovata' });
    }

    res.status(200).json(recipe);
  } 
  catch (err) {
    console.error('Errore nel recupero della ricetta:', err);
    res.status(500).json({ message: 'Errore del server' });
  }
};

// Recupera ricette create da utente
exports.getUserRecipes = async (req, res) => {
  try {
    const userRecipes = await Recipe.find({ autore: req.user.userId });
    res.json(userRecipes); 
  } 
  catch (err) {
    console.error("Errore nel recupero delle ricette dell'utente:", err);
    res.status(500).json({ error: 'Errore nel recupero delle ricette' });
  }
};

// Crea una ricetta
exports.createRecipe = async (req, res) => {
  try {
    const autoreId = req.user.userId;
    const recipeData = { ...req.body, autore: autoreId };

    const newRecipe = new Recipe(recipeData);
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } 
  catch (err) {
    console.error("Errore creazione ricetta:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(400).json({ error: 'Errore nella creazione della ricetta' });
  }
};

// Modifica una ricetta
exports.updateRecipe = async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!updatedRecipe) 
      return res.status(404).json({ error: 'Ricetta non trovata' }); 
    res.json(updatedRecipe);
  } 
  catch (err) {
    res.status(400).json({ error: 'Errore aggiornamento della ricetta' });
  }
};

// Elimina una ricetta
exports.deleteRecipe = async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) 
      return res.status(404).json({ error: 'Ricetta non trovata' });
    res.json({ message: 'Ricetta eliminata con successo' });
  } 
  catch (err) {
    res.status(500).json({ error: 'Errore eliminazione della ricetta' });
  }
};