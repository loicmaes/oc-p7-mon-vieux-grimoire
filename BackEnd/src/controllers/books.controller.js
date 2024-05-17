const Book = require('../database/models/book.model');
const authRequired = require('../middlewares/auth.middleware');
const fileInterceptor = require('../middlewares/file.middleware');
const permissionRequired = require('../middlewares/permission.middleware');
const multerConfig = require('../configs/multer.config');

function avg (numberArray) {
  let sum = 0;
  numberArray.forEach(n => sum += n);
  return sum / numberArray.length;
}

module.exports = (app) => {
  // ACTION: recover the whole book list
  app.get('/books', async (req, res) => {
    try {
      const books = await Book.find({}, null, null).exec();
      if (!books.length) return res.status(204).json();

      res.json(books.map(b => {
        console.log({
          ...b._doc,
          averageRating: avg(b.ratings.map(r => r.grade)),
        });
        return {
          ...b._doc,
          averageRating: avg(b.ratings.map(r => r.grade)),
        };
      }));
    } catch (e) {
      res.status(500).json(e);
    }
  });
  // ACTION: recover best ratings
  app.get('/books/bestrating', async (req, res) => {
    try {
      const books = await Book.find().sort({
        averageRating: -1
      });
      return res.status(206).json(books.splice(0, 3));
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  });
  // ACTION: recover a book detail (filtered by _id)
  app.get('/books/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const book = await Book.findById(id).exec();
      if (!book) return res.status(404).json();
      res.json({
        ...book._doc,
        averageRating: avg(book.ratings.map(r => r.grade)),
      });
    } catch (e) {
      res.status(500).json(e);
    }
  });
  // ACTION: add a new book to the list
  app.post('/books', authRequired, multerConfig, fileInterceptor, async (req, res) => {
    const userId = req.userId;
    const { title, author, genre, year, ratings } = JSON.parse(req.body.book);
    const { imageUrl } = req.body;

    try {
      const data = await Book.create({
        userId,
        title,
        author,
        genre,
        imageUrl,
        year,
        ratings,
        averageRating: ratings[0].grade ?? 0,
      });
      res.status(201).json(data);
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  });
  // ACTION: update book info
  app.put('/books/:id', authRequired, multerConfig, permissionRequired, fileInterceptor, async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    const { title, author, genre, imageUrl, year } = req.body;

    console.log(req.body);

    try {
      await Book.findByIdAndUpdate({
        _id: id,
        userId,
      }, {
        title, author, genre, imageUrl, year
      });
      const data = await Book.findById(id);
      return res.json(data);
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  });
  // ACTION: delete book info
  app.delete('/books/:id', authRequired, permissionRequired, async (req, res) => {
    const id = req.params.id;

    try {
      await Book.findByIdAndDelete(id);
      res.json('Book deleted!');
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  });
  // ACTION: rate a book
  app.post('/books/:id/rating', authRequired, async (req, res) => {
    const id = req.params.id;
    const userId = req.userId;
    const { grade } = req.body;

    try {
      const _book = await Book.findById(id);
      if (!_book) return res.status(404).json('Book not found!');
      if (_book.ratings.map(r => r.userId).includes(userId)) return res.status(409).json('You already rated this book!');

      await Book.findByIdAndUpdate(id, {
        ratings: [
            ..._book.ratings,
          {
            userId,
            grade: grade ?? 0,
          },
        ],
        averageRating: avg(book.ratings.map(r => r.grade)),
      });

      const book = await Book.findById(id);
      return res.status(201).json(book);
    } catch (e) {
      return res.status(500).json(e);
    }
  });
};
