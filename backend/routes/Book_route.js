const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const bookCtrl = require('../controllers/Book_controller');

router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.get('/bestrating', bookCtrl.getBestRatedBooks);
router.post('/', auth, multer, bookCtrl.createBook);
// router.put('/books/:id', bookCtrl.modifyBook);
// router.delete('/books/:id', bookCtrl.deleteBook);
// router.post('/books/:id/rating', bookCtrl.rateBook);

module.exports = router;