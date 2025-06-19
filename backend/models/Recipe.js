const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  titolo: {
    type: String,
    required: [true, 'Il titolo della ricetta è obbligatorio'],
    trim: true,
    maxlength: [100, 'Il titolo non può superare i 100 caratteri']
  },
  descrizione: {
    type: String,
    trim: true,
    maxlength: [200, 'La descrizione non può superare i 200 caratteri']
  },
  procedimento: {
    type: [String],
    required: [true, 'Il procedimento è obbligatorio'],
    validate: {
      validator: function(steps) {
        return steps.length > 0;
      },
      message: 'Inserire almeno un passaggio del procedimento'
    }
  },
  ingredienti: {
    type: [String],
    required: [true, 'Gli ingredienti sono obbligatori'],
    validate: {
      validator: function(ingredients) {
        return ingredients.length > 0;
      },
      message: 'Inserire almeno un ingrediente'
    }
  },
  tempoPreparazione: {
    type: Number,
    min: [1, 'Il tempo di preparazione deve essere almeno 1 minuto']
  },
   image: {
    type: String,
    trim: true,
    default: ''
  },
   autore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Aggiungi un indice per la ricerca full-text
recipeSchema.index({ 
  titolo: 'text', 
  descrizione: 'text', 
  ingredienti: 'text' 
}, {
  weights: {
    titolo: 3,
    ingredienti: 2,
    descrizione: 1
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);