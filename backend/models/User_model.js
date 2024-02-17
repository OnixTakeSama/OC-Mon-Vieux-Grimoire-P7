const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création du schéma de données attendu pour un utilisateur

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // unique: true empêche la création de plusieurs comptes avec la même adresse mail
    password: { type: String, required: true }
});


userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);