const authRequired = require('../middlewares/auth.middleware');
const fileInterceptor = require('../middlewares/file.middleware');
const permissionRequired = require('../middlewares/permission.middleware');
const multerConfig = require('../configs/multer.config');
const { getBooksList, getBestRated, getBook, createBook, updateBook, deleteBook, rate} = require('../functions/books.function');


module.exports = (app) => {
  // ACTION: recover the whole book list
  app.get('/books', async (req, res) => {
    await getBooksList(res);
  });
  // ACTION: recover best ratings
  app.get('/books/bestrating', async (req, res) => {
    await getBestRated(res);
  });
  // ACTION: recover a book detail (filtered by _id)
  app.get('/books/:id', async (req, res) => {
    await getBook(res, req.params.id);
  });
  // ACTION: add a new book to the list
  app.post('/books', authRequired, multerConfig, fileInterceptor, async (req, res) => {
    const userId = req.userId;
    const { title, author, genre, year, ratings } = JSON.parse(req.body.book);
    const { imageUrl } = req.body;
    await createBook(res, {
      userId,
      title,
      author,
      genre,
      year,
      ratings,
      imageUrl
    });
  });
  // ACTION: update book info
  app.put('/books/:id', authRequired, multerConfig, permissionRequired, fileInterceptor, async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    const { title, author, genre, imageUrl, year } = req.body;
    await updateBook(res, id, {
      userId, title, author, genre, imageUrl, year
    });
  });
  // ACTION: delete book info
  app.delete('/books/:id', authRequired, permissionRequired, async (req, res) => {
    await deleteBook(res, req.params.id);
  });
  // ACTION: rate a book
  app.post('/books/:id/rating', authRequired, async (req, res) => {
    const id = req.params.id;
    const userId = req.userId;
    const { rating } = req.body;

    await rate(res, id, { userId, grade: rating });
  });
};
