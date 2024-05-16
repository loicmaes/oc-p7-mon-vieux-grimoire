const Book = require('../database/models/book.model');
const authRequired = require('../middlewares/auth.middleware');
const fileInterceptor = require('../middlewares/file.middleware');

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
  })
  // ACTION: add a new book to the list
  app.post('/books', authRequired, fileInterceptor, async (req, res) => {
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
  })
};
