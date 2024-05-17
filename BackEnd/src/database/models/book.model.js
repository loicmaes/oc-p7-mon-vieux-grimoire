const mongoose = require('mongoose');
const validators = require('../validators');

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User id is required!'],
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      grade: {
        type: Number,
        required: true,
        validate: {
          validator: (value) => validators.minmax(value, 0, 5),
          message: _ => 'Grade must be between 0 and 5 included!',
        }
      }
    }
  ],
  averageRating: {
    type: Number,
    defaultValue: 0,
    validate: {
      validator: (value) => validators.minmax(value, 0, 5),
      message: _ => 'Grade must be between 0 and 5 included!'
    }
  }
});

const Book = mongoose.model('Book', schema);
module.exports = Book;
