const Book = require('../database/models/book.model');

module.exports = async (req, res, next) => {
  if (!req.params.id) return next();

  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json('Book not found!');

  if (book.userId != req.userId) return res.status(401).json('Not authorized!');

  next();
}
