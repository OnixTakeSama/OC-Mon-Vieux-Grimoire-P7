const multer = require("multer");

// On stocke l'image dans la mémoire pour la transformer avec sharp
const storage = multer.memoryStorage()

module.exports = multer({ storage }).single('image')