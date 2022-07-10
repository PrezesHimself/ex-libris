const mongoose = require('mongoose');
const Book = mongoose.model(
  'Book',
  new mongoose.Schema({
    name: String,
    library: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Library',
    },
  })
);
module.exports = Book;
