const sharp = require("sharp")
const path = require('path')

module.exports = (req, res, next) => {

    // On vérifie si un fichier est envoyé, si ce n'est pas le cas on passe à la suite
    console.log("req.file:", req.file)
    if (!req.file) {
        next()
        return
    }

    const { buffer, fieldname } = req.file;

    // On crée un nom de fichier unique
    const filename = `${fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;

    // On traite l'image avec sharp
    sharp(buffer)
        .webp()
        .toFile(path.resolve(__dirname, `../images/${filename}`), (err, info) => {
            console.log(err || info)
            if (err) {
                return res.status(400).json({ error: err })
            }
            req.file.filename = filename
            next()
        })
}