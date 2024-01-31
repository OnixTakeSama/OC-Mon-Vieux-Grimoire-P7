const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
// const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const bookCtrl = require('../controllers/Book_controller');

router.get('/books', bookCtrl.getAllBooks);
router.get('/books/:id', bookCtrl.getOneBook);
router.get('/books/bestrating', bookCtrl.getBestRatedBooks);
router.post('/books', multer, bookCtrl.createBook);
// router.put('/books/:id', bookCtrl.modifyBook);
// router.delete('/books/:id', bookCtrl.deleteBook);
// router.post('/books/:id/rating', bookCtrl.rateBook);

module.exports = router;