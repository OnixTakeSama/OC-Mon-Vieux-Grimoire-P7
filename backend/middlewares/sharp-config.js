const sharp = require("sharp")
const path = require('path')

module.exports = (req, res, next) => {

    console.log("req.file:", req.file)
    if (!req.file) {
        next()
        return
    }

    const { buffer, fieldname } = req.file;
    const filename = `${fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
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