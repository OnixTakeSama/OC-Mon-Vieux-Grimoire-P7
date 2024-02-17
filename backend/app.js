const dotenv = require("dotenv").config();
const express = require('express');
const userRoutes = require('./routes/User_route');
const bookRoutes = require('./routes/Book_route');

const mongoose = require('mongoose');
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const cluster = process.env.DB_CLUSTER;
const connectionString = `mongodb+srv://${username}:${password}@${cluster}.gjwjxds.mongodb.net/?retryWrites=true&w=majority`;

const app = express();

mongoose.connect(connectionString,
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
app.use("/api/books", bookRoutes);
app.use("/images", express.static("images"));

module.exports = app;
