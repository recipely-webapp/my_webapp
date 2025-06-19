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

const allowedOrigins = [
  'http://localhost:3000', // Il tuo frontend in locale
  'https://my-webapp-beryl.vercel.app' // Il tuo frontend deployato su Vercel
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permetti richieste senza 'origin' (come Postman o app mobile) o se l'origine è nella lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

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