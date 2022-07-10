const mongoose = require('mongoose');
const Library = mongoose.model(
  'Library',
  new mongoose.Schema({
    name: String,
    imageUrl: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  })
);
module.exports = Library;
