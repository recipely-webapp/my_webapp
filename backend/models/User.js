const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "L'username è obbligatorio"],
    trim: true,    // Pulisce gli spazi bianchi
    unique: true,
    lowercase: true, // Salva tutto in minuscolo
  },
  email: {
    type: String,
    required: [true, "L'email è obbligatoria"], 
    trim: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+.\S+/, "L'email non è valida"],    // Regex: carattere, @, almeno un blocco, ., estensione
},
  password: {
    type: String,
    required: [true, "La password è obbligatoria"],
    minlength: [6, "La password deve essere di almeno 6 caratteri"],
  },
   // Array di ID che puntano alle ricette preferite
  favorites: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Recipe',
  default: []
}]

}, );
// Hook per l'hashing 

userSchema.pre('save', async function (next) {  
  if (!this.isModified('password')) { 
    return next();
 }
 try {
  // Crea l'hash della password combinando password e salt
        const salt = await bcrypt.genSalt(10);  
        this.password = await bcrypt.hash(this.password, salt); 
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) { 
   // Bcrypt confronta la password del form con l'hash nel database
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);