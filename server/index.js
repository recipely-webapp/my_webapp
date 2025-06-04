// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Esempio route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Ciao dal backend!' });
});

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB connesso');
    app.listen(PORT, () => console.log(` Server in ascolto su http://localhost:${PORT}`));
  })
  .catch(err => console.error('Errore MongoDB:', err));
