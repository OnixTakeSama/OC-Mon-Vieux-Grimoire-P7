const Book = require('../models/Book_model');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
    // On récupère tous les livres de la BDD
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error: 'Aucun livre n\'a été trouvé' }));
};

exports.getOneBook = (req, res, next) => {
    // On récupère un livre précis de la BDD
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error: 'Livre non trouvé !' }));
};

exports.getBestRatedBooks = (req, res, next) => {
    // On récupère les 3 livres les mieux notés de la BDD
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error: 'Aucun livre n\'a été trouvé' }));
};

exports.createBook = (req, res, next) => {
    // On récupère les informations envoyées par le front-end
    const bookObject = JSON.parse(req.body.book);

    // On supprime l'id et le userId envoyés par le front-end : on ne fait pas confiance au front-end
    delete bookObject._id;
    delete bookObject._userID;

    // On crée un nouvel objet Book avec les informations envoyées par le front-end
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // On enregistre le livre dans la BDD
    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
    // On recherche le livre dans la BDD
    Book.findOne({ _id: req.params.id })
        .then(book => {
            // On vérifie que l'utilisateur est bien le propriétaire du livre
            if ( book.userId !== req.auth.userId ) {
                res.status(403).json({ message: '403: Unauthorized Request' });
            } else {
                const oldImage = book.imageUrl.split('/images/')[1];
                // Si une nouvelle image est envoyée, on supprime l'ancienne image des fichiers locaux
                if (req.file) {
                    fs.unlink(`images/${oldImage}`, () => {});
                }
                // On vérifie si une nouvelle image est envoyée
                const bookObject = req.file ?
                    {
                        ...JSON.parse(req.body.book),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    } : { ...req.body };
                // On met à jour le livre dans la BDD
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
                    .catch(error => res.status(400).json({ error }));
            };
        })
        // Si le livre n'est pas trouvé dans la BDD, on renvoie une erreur 404
        .catch(error => res.status(404).json({ error }));
}

exports.rateBook = (req, res, next) => {
    // On recherche le livre dans la BDD
    Book.findOne({ _id: req.params.id })
        .then(book => {
            // On vérifie que l'utilisateur n'a pas déjà noté le livre
            const hasUserRated = book.ratings.some(rating => rating.userId === req.auth.userId);
            if (hasUserRated) {
                res.status(403).json({ message: '403: Unauthorized Request' });
            }
            // On récupère la liste des notes et on ajoute la nouvelle note
            const ratings = book.ratings;
            ratings.push({ userId: req.auth.userId, grade: req.body.rating });
            // On calcule le total des notes et la moyenne
            const totalRating = ratings.reduce((acc, rating) => acc + rating.grade, 0);
            const averageRating = (totalRating / ratings.length).toFixed(1);
            // On met à jour le livre dans la BDD
            Book.findByIdAndUpdate({ _id: req.params.id }, { ratings, averageRating, _id: req.params.id }, { new: true })
                .then(data => res.status(200).json(data))
                .catch(error => res.status(400).json({ error }));
        })
};

exports.deleteBook = (req, res, next) => {
    // On recherche le livre dans la BDD
    Book.findOne({ _id: req.params.id })
        .then(book => {
            // On vérifie que l'utilisateur est bien le propriétaire du livre
            if ( book.userId !== req.auth.userId ) {
                // Si ce n'est pas le cas, on renvoie une erreur 403
                res.status(403).json({ message: '403: Unauthorized Request' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                // On supprime l'image des fichiers locaux et le livre de la BDD
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
                        .catch(error => res.status(400).json({ error: 'La suppression à échoué !' }));
                });
            };
        })
        // Si le livre n'est pas trouvé dans la BDD, on renvoie une erreur 404
        .catch(error => res.status(404).json({ error }));
};