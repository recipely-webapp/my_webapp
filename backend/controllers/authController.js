const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');

// Generazione token (payload, chiave segreta e opzioni)
const generateTokens = (userId) => {
    const accessToken = jwt.sign( 
        { userId: userId },
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: '15m' } 
    );
    const refreshToken = jwt.sign( 
        { userId: userId }, 
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' } 
    );
    return { accessToken, refreshToken };
};

// Registrazione utente
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;  
        const userByUsername = await User.findOne({ username });
        if (userByUsername) {
            return res.status(400).json({ message: "Username già in uso" });
        }
        const userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ message: "Email già in uso" });
        }

        // Crea e salva nuovo utente
        const newUser = new User({ username, email, password});
        await newUser.save(); 

        res.status(201).json({ 
            message: "Utente registrato con successo!", 
            userId: newUser._id });

    } catch (error) {
        console.error("Errore registrazione:", error);

        // Errori di validazione generati da Moongose
        if (error.name === 'ValidationError') {  
            const messages = Object.values(error.errors).map(val => val.message);  
            return res.status(400).json({ message: messages.join('. ') }); 
        }
        res.status(500).json({ message: "Errore del server durante la registrazione" });
    }
};

// Login Utente
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;  
        if (!email || !password) {
            return res.status(400).json({ message: "Email e password sono obbligatori" });
        }
        const user = await User.findOne({ email });  
        if (!user) {
            return res.status(401).json({ message: "Credenziali non valide" });
        }
        // Confronta la password fornita con quella del database
        const isMatch = await user.comparePassword(password);  
        if (!isMatch) {
            return res.status(401).json({ message: "Credenziali non valide" }); 
        }

        // Genera i token se le credenziali sono corrette
        const { accessToken, refreshToken } = generateTokens(user._id);  
        await RefreshToken.create({ token: refreshToken, userId: user._id }); 

        // Imposta un cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,        
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.json({  
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

// Generazione nuovo access token
exports.refreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(401).json({ message: "Refresh token mancante nel cookie" });
    }
    const refreshTokenFromCookie = cookies.jwt;
    const foundToken = await RefreshToken.findOne({ token: refreshTokenFromCookie });

    if (!foundToken) {
        return res.status(403).json({ message: "Il refresh token non è valido o è stato revocato" });
    }

    try {
        const decoded = jwt.verify(refreshTokenFromCookie, process.env.REFRESH_TOKEN_SECRET);

        if (foundToken.userId.toString() !== decoded.userId) {
            return res.status(403).json({ message: "Corrispondenza utente fallita" });
        }

        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' } 
        );

        res.json({ accessToken: newAccessToken });
    }
    catch (err) {
        return res.status(403).json({ message: "Il refresh token non è valido" });
    }
};

    // Logout Utente
exports.logoutUser = async (req, res) => {
    const cookies = req.cookies;  
    if (!cookies?.jwt) {
        return res.sendStatus(204); 
    }
    const refreshTokenFromCookie = cookies.jwt;
    
    // Elimina il refresh token e pulisco il cookie
    try {
        await RefreshToken.deleteOne({ token: refreshTokenFromCookie });

        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
        });
        res.status(200).json({ message: "Logout effettuato con successo." });

    } catch (error) {
        console.error("Errore logout:", error);
        res.status(500).json({ error: "Errore del server durante il logout." });
    }
};