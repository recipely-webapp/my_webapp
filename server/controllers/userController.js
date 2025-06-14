const User = require('../models/User');
const Recipe = require('../models/Recipe');
exports.toggleFavorite = async (req, res) => {
  try {
     const userId = req.user.userId; 
    
    // CORREZIONE 2: Usa 'recipeId' dal parametro della rotta
    const recipeId = req.params.recipeId;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    const index = user.favorites.indexOf(recipeId);
    if (index > -1) {
      user.favorites.splice(index, 1); // rimuovi se già nei preferiti
    } else {
      user.favorites.push(recipeId); // aggiungi se non presente
    }

    await user.save();
    res.status(200).json({ favorites: user.favorites });

  } catch (err) {
    console.error('Errore toggleFavorite:', err);
    res.status(500).json({ message: 'Errore server toggle favorite' });
  }
};
exports.getFavorites = async (req, res) => {
  try {
    // CORREZIONE 1: Usa 'userId' dal payload del token
    const userId = req.user.userId;
    const user = await User.findById(userId).populate('favorites');
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dei preferiti' });
  }
};
