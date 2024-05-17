const Book = require('../database/models/book.model');
const authRequired = require('../middlewares/auth.middleware');
const fileInterceptor = require('../middlewares/file.middleware');
const permissionRequired = require('../middlewares/permission.middleware');
const multerConfig = require('../configs/multer.config');

module.exports = (app) => {
  // ACTION: recover the whole book list
  app.get('/books', async (req, res) => {
    try {
      const books = await Book.find({}, null, null).exec();
      if (!books.length) return res.status(204).json();
      res.json(books);
    } catch (e) {
      res.status(500).json(e);
    }
  });
  // ACTION: recover a book detail (filtered by _id)
  app.get('/books/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const book = await Book.findById(id).exec();
      if (!book) return res.status(404).json();
      res.json(book);
    } catch (e) {
      res.status(500).json(e);
    }
  });
  // ACTION: add a new book to the list
  app.post('/books', authRequired, multerConfig, fileInterceptor, async (req, res) => {
    const userId = req.userId;
    const { title, author, genre, imageUrl, year } = req.body;

    try {
      const data = await Book.create({
        userId,
        title,
        author,
        genre,
        imageUrl,
        year,
      });
      res.status(201).json(data);
    } catch (e) {
      res.status(500).json(e);
    }
  });
  // ACTION: update book info
  app.put('/books/:id', authRequired, multerConfig, permissionRequired, fileInterceptor, async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    const { title, author, genre, imageUrl, year } = req.body;

    try {
      await Book.findByIdAndUpdate({
        _id: id,
        userId,
      }, {
        title, author, genre, imageUrl, year
      });
      const data = await Book.findById(id);
      res.json(data);
    } catch (e) {
      res.status(500).json(e);
    }
  });
};
