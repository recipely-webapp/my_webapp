// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Importa qui
require('dotenv').config();
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();

const PORT = process.env.PORT || 5000;

// --- ORDINE CORRETTO DEI MIDDLEWARE ---
app.set('trust proxy', 1); 
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser()); // <-- POSIZIONE CORRETTA!
app.use(express.json());

// --- ROTTE ---
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB connesso');
    app.listen(PORT, () => console.log(` Server in ascolto su http://localhost:${PORT}`));
  })
  .catch(err => console.error('Errore MongoDB:', err));