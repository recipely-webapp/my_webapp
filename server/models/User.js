const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  //versione puramente in JavaScript di bcrypt

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "L'username è obbligatorio"],
    trim: true,   // rimuove automaticamente gli spazi bianchi all'inizio e alla fine del valore stringa
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "L'email è obbligatoria"], 
    trim: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+.\S+/, "L'email non è valida"],  //è una regex che verifica se: ha almeno un carattere prima di @, almeno un dominio dopo @, ha un . con qualcosa dopo
},
  password: {
    type: String,
    required: [true, "La password è obbligatoria"],
    minlength: [6, "La password deve essere di almeno 6 caratteri"],
  },
  favorites: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Recipe',
  default: []
}]

}, );

// Hash della password prima del salvataggio
userSchema.pre('save', async function (next) {  //middleware per criptare la password prima del salvataggio
  if (!this.isModified('password')) {  //evita di ricriptare di nuovo la password
    return next();
 }
 try {
        const salt = await bcrypt.genSalt(10);  //genera un salt (stringa casuale), 10 indica il numero di volte in cui bcrypt ripete il processo per criptare la password
        this.password = await bcrypt.hash(this.password, salt); //sostituisce this.password con la versione hashata (nel database viene salvata solo la password criptata)
        next();
    } catch (error) {
        next(error);
    }
});

// Metodo per confrontare password
userSchema.methods.comparePassword = async function (candidatePassword) { //confronta la password inserita con l'hash salvato nel database
  return bcrypt.compare(candidatePassword, this.password); //non decripta la password, ma crea un nuovo hash della password e lo confronta con l'hash salvato
};

module.exports = mongoose.model('User', userSchema);