const sharp = require('sharp');
const fs = require('fs');

const resizeImage = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier envoyé' });
    }

    sharp(req.file.path)
        .resize(500, 500)
        .toFormat('webp')
        .toFile(`images/${req.file.filename}`, (err, info) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors du traitement de l\'image' });
            }
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Erreur lors de la suppression du fichier d\'origine', unlinkErr);
                }
                next();
            });
        });
};

module.exports = resizeImage;