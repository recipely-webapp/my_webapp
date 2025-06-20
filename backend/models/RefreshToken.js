const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  token: { 
    type: String, 
    required: true 
  },
  // Collega il token all'utente proprietario
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { 
    type: Date,
    default: Date.now,
    expires: '7d' // Crea indice TTL
  }, 
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);