const bcrypt = require('bcrypt');
const User = require('../models/User_model');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");
const cryptoJs = require("crypto-js"); 

var schemaMDP = new passwordValidator();

schemaMDP
    .is().min(8)
    .is().max(20)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().digits(1)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password1', 'Password2', 'Password3', 'Azerty1', 'Azerty2']);

exports.signup = (req, res, next) => {
    if (emailValidator.validate(req.body.email) && schemaMDP.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: cryptoJs.HmacSHA512(req.body.email, process.env.EMAIL_SECRET_KEY).toString(),
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));

    } else {
        return res.status(400).json({ message: 'Email ou mot de passe invalide !' });
    }
}

exports.login = (req, res, next) => {
    User.findOne({ email: cryptoJs.HmacSHA512(req.body.email, process.env.EMAIL_SECRET_KEY).toString() })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect !' });
                    }
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