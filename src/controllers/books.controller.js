const Book = require('../database/models/book.model');

module.exports = (app) => {
  app.get('/books', (req, res) => {
    Book.find({})
        .then(data => {
          res.json(data);
        })
        .catch(console.error);
  });
};
