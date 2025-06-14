const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt =require('jsonwebtoken');

// Funzione helper per generare i token
const generateTokens = (userId) => {
    const accessToken = jwt.sign(  // Header
        { userId: userId }, // Payload
        process.env.ACCESS_TOKEN_SECRET,  // Firma per garantire autenticità
        { expiresIn: '15m' } // Access token scade dopo 15 minuti
    );
    const refreshToken = jwt.sign(  // Genera un nuovo access token se è scaduto
        { userId: userId }, 
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }  // Refresh token scade dopo 7 giorni
    );
    return { accessToken, refreshToken };
};

// Registrazione Utente
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;  // Estrae username, email e password dal form di registrazione

    // Controlla se l'utente o l'email esistono già
      const userByUsername = await User.findOne({ username });
        if (userByUsername) {
            return res.status(400).json({ message: "Username già in uso" });
        }
        const userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ message: "Email già in uso" });
        }

        const newUser = new User({ username, email, password});
        await newUser.save(); // Viene eseguito il pre('save') per criptare la password

        res.status(201).json({ 
            message: "Utente registrato con successo!", 
            userId: newUser._id });

    } catch (error) {
        console.error("Errore registrazione:", error);
        // Gestione degli errori di validazione di Mongoose
        if (error.name === 'ValidationError') {  //Controlla il tipo di errore
            const messages = Object.values(error.errors).map(val => val.message);  // Restituisce un array con tutti gli errori, considerando solo il testo dell'errore da ciascun messaggio
            return res.status(400).json({ message: messages.join('. ') });  // Restituisce i messaggi in una sola stringa, separati da un punto e spazio
        }
        res.status(500).json({ 
            message: "Errore del server durante la registrazione" });
    }
};
// Login Utente
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;  // Estrae email e password dai dati del form inviati dal client
        if (!email || !password) {
            return res.status(400).json({ message: "Email e password sono obbligatori" });
        }
        const user = await User.findOne({ email });  // Cerca un utente nel database usando l'email
        if (!user) {
            return res.status(401).json({ message: "Credenziali non valide" });
        }

        const isMatch = await user.comparePassword(password);  // Confronta la password scritta dall'utente con quella criptata salvata nel DB
        if (!isMatch) {
            return res.status(401).json({ message: "Credenziali non valide" }); 
        }
        const { accessToken, refreshToken } = generateTokens(user._id);  // Se le credenziali sono valide, crea accessToken e refreshToken

        // Salva il refresh token nel database
        console.log(`[LOGIN] Salvataggio refresh token nel DB: ${refreshToken} per utente ${user._id}`);
        await RefreshToken.create({ token: refreshToken, userId: user._id });  // Salva il refresh token in una collezione RefreshToken, associandolo all'utente

        // Imposta il refresh token in un cookie HTTPOnly
        res.cookie('jwt', refreshToken, {
            httpOnly: true,        
            secure: process.env.NODE_ENV === 'production',  //Cookie inviato solo su connessioni HTTPS
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', //Blocca il cookie se usato in un'altra origine
            maxAge: 7 * 24 * 60 * 60 * 1000 //Scadenza in millisecondi (7 giorni)
        });

        res.json({   // Restituisce una risposta JSON
            message: "Login effettuato con successo!",
            accessToken,
            user: { 
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Errore login:", error);
        res.status(500).json({ message: "Errore del server durante il login" });
    }
};
exports.refreshToken = async (req, res) => {
    // 1. Controlla se il cookie con il refresh token esiste
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        // Se non c'è il cookie, non c'è modo di autenticare.
        return res.status(401).json({ message: "Non autorizzato: Refresh token mancante nel cookie" });
    }

    const refreshTokenFromCookie = cookies.jwt;

    // 2. Cerca il refresh token nel nostro database
    // Questo ci assicura che il token non sia stato invalidato (es. da un logout)
    const foundToken = await RefreshToken.findOne({ token: refreshTokenFromCookie }).exec();

    if (!foundToken) {
        // Se qualcuno tenta di usare un refresh token che non è più nel nostro DB (es. dopo un logout),
        // è un tentativo sospetto. Non è solo "non valido", è "proibito".
        return res.status(403).json({ message: "Proibito: Il refresh token non è valido o è stato revocato" });
    }

    // 3. Verifica la validità del token JWT e che appartenga all'utente corretto
    try {
        const decoded = jwt.verify(refreshTokenFromCookie, process.env.REFRESH_TOKEN_SECRET);

        // Controllo di sicurezza cruciale: l'ID utente nel token DEVE corrispondere
        // a quello associato al token nel nostro database.
        if (foundToken.userId.toString() !== decoded.userId) {
            return res.status(403).json({ message: "Proibito: Corrispondenza utente fallita" });
        }

        // 4. Se tutti i controlli passano, il refresh token è valido.
        // Generiamo un NUOVO access token.
        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' } // Scadenza breve
        );

        // 5. Invia il nuovo access token al client
        res.json({ accessToken: newAccessToken });

    } catch (err) {
        // Se jwt.verify fallisce (es. token malformato o firma non valida), restituisci un errore.
        return res.status(403).json({ message: "Proibito: Il refresh token non è valido" });
    }
};


    // Logout Utente
exports.logoutUser = async (req, res) => {
    const cookies = req.cookies;  //Estrae i cookie dalla richiesta
    if (!cookies?.jwt) {
        return res.sendStatus(204); //Se non esiste, nessun token da cancellare
    }
    const refreshTokenFromCookie = cookies.jwt;

    try {
        await RefreshToken.deleteOne({ token: refreshTokenFromCookie });

        // --- PULIZIA DEL COOKIE CHE CORRISPONDE ALLA CREAZIONE ---
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
        });
        res.status(200).json({ message: "Logout effettuato con successo." });

    } catch (error) {
        console.error("Errore logout:", error);
        res.status(500).json({ message: "Errore del server durante il logout." });
    }
};