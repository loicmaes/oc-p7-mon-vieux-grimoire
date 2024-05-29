const Book = require("../database/models/book.model");

function average (numberArray) {
  let sum = 0;
  numberArray.forEach(n => sum += n);
  return sum / numberArray.length;
}

async function getBooksList (res) {
  try {
    const books = await Book.find({}, null, null).exec();
    if (!books.length) return res.status(204).json();

    res.json(books.map(b => {
      return {
        ...b._doc,
        averageRating: average(b.ratings.map(r => r.grade)),
      };
    }));
  } catch (e) {
    res.status(500).json(e);
  }
}

async function getBook (res, id) {
  try {
    const book = await Book.findById(id).exec();
    if (!book) return res.status(404).json();
    res.json(book);
  } catch (e) {
    res.status(500).json(e);
  }
}

async function getBestRated (res) {
  try {
    const books = await Book.find().sort({
      averageRating: -1
    });

    return res.status(206).json(books.splice(0, 3));
  } catch (e) {
    return res.status(500).json(e);
  }
}

async function createBook (res, { userId, title, author, genre, imageUrl, year, ratings}) {
  try {
    await Book.create({
      userId,
      title,
      author,
      genre,
      imageUrl,
      year,
      ratings,
      averageRating: average(ratings.map(r => r.grade)),
    });
    res.status(201).json({
      message: 'Le livre a été créé avec succès !'
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
}

async function updateBook (res, id, { userId, title, author, genre, imageUrl, year }) {
  try {
    await Book.findByIdAndUpdate({
      _id: id,
      userId,
    }, {
      title, author, genre, imageUrl, year
    });
    return res.json({
      message: `Le livre ${id} a été modifié !`,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
}

async function deleteBook (res, id) {
  try {
    await Book.findByIdAndDelete(id);
    res.json({
      message: 'Book deleted!',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
}

async function rate(res, id, { userId, grade }) {
  try {
    const _book = await Book.findById(id).exec();
    if (!_book) return res.status(404).json({ message: 'Book not found!'});
    if (_book.ratings.map(r => r.userId).includes(userId)) return res.status(409).json({message: 'You already rated this book!'});

    const ratings = [
      ..._book.ratings,
      {
        userId,
        grade: grade ?? 0,
      },
    ]

    await Book.findByIdAndUpdate(id, {
      ratings,
      averageRating: average(ratings.map(r => r.grade)),
    });

    const book = await Book.findById(id).exec();
    return res.status(201).json(book);
  } catch (e) {
    return res.status(500).json(e);
  }
}

module.exports = {
  getBooksList,
  getBook,
  getBestRated,
  createBook,
  updateBook,
  deleteBook,
  rate,
}
