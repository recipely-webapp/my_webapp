// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();  // Carica le variabili d'ambiente (dati sensibili)
// Importazione delle routes
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');


const app = express();

const PORT = process.env.PORT || 5000;

// Domini autorizzati a fare richieste al server
const allowedOrigins = [
  'http://localhost:3000', 
  'https://my-webapp-beryl.vercel.app' 
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permette richieste se non c'è un dominio o dalla whitelist

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
   // Permette invio di cookie tra domini diversi
  credentials: true,
};
// Applica le regole di CORS
app.use(cors(corsOptions));
// Permette ad Express di leggere i cookie e il corpo delle richieste
app.use(cookieParser()); 
app.use(express.json());

// Route dell'applicazione
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
// Connessione al database e avvio del server Express
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB connesso');
    app.listen(PORT, () => console.log(` Server in ascolto su http://localhost:${PORT}`));
  })
  .catch(err => console.error('Errore MongoDB:', err));