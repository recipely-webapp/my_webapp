const User = require('../models/User');
const Recipe = require('../models/Recipe');

// Aggiunge o rimuove una ricetta dai preferiti
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const recipeId = req.params.recipeId;

    // Trova utente nel database
    const user = await User.findById(userId);
      if (!user) 
        return res.status(404).json({ message: 'Utente non trovato' });

    // Controlla se la ricetta è nei preferiti
    const index = user.favorites.indexOf(recipeId);

    if (index > -1) {
      user.favorites.splice(index, 1); 
    } else {
      user.favorites.push(recipeId); 
    }

    await user.save();
    res.status(200).json({ favorites: user.favorites });
  } 

  catch (err) {
    console.error('Errore toggleFavorite:', err);
    res.status(500).json({ message: 'Errore server durante aggiornamento.' });
  }
};

// Recupera la lista delle ricette preferite
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Trova utente nel database
    const user = await User.findById(userId).populate('favorites');
    if (!user) 
      return res.status(404).json({ error: 'Utente non trovato' });

    res.json({ favorites: user.favorites });
  } 
  catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dei preferiti' });
  }
};