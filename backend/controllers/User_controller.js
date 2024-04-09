const bcrypt = require('bcrypt');
const User = require('../models/User_model');
const jwt = require('jsonwebtoken');
// const dotenv = require("dotenv").config();

// if (dotenv.error) {
//     throw new Error('Unable to load .env file')
// }

// Fonction pour vérifier si l'email est valide
function isValideEmail(email) {
    const emailRegEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegEx.test(email);
};

exports.signup = (req, res, next) => {

    // On vérifie que l'email est entré et que son format est valide
    if (!req.body.email || !isValideEmail(req.body.email)) {
        console.log('Email manquante ou invalide !');
        return res.status(400).json({ error: 'Email manquante ou invalide !' });
    }

    // On vérifie que le mot de passe est entré
    if (!req.body.password) {
        console.log('Mot de passe requis !');
        return res.status(400).json({ error: 'Mot de passe requis !' });
    }

    // On crypte le mot de passe
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // On crée un nouvel utilisateur avec l'email et le mot de passe crypté
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // On enregistre l'utilisateur dans la BDD
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
}

exports.login = (req, res, next) => {
    // On recherche l'utilisateur dans la BDD
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si l'utilisateur n'est pas trouvé, on renvoie une erreur 401
            if (!user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé !' });
            }
            // Si l'utilisateur est trouvé, on compare le mot de passe envoyé avec le mot de passe enregistré
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si le mot de passe est incorrect, on renvoie une erreur 401
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect !' });
                    }
                    // Si le mot de passe est correct, on renvoie un token d'authentification
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_SECRET_KEY,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
}