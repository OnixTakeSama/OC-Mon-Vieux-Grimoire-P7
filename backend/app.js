const dotenv = require("dotenv").config();
const express = require('express');
const userRoutes = require('./routes/User_route');

const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.CONNECTION_STRING,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use("/api/auth", userRoutes); 

app.use('/api/books', (req, res, next) => {
    const books = require('../frontend/public/data/data.json');
    res.status(200).json(books);
});

module.exports = app;
