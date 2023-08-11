const mongoose = require('mongoose');

const { Schema } = mongoose;

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
});

// Virtual for book's URL
BookSchema.virtual('url').get(function handler() {
  // We don't use an arrow function as we'll need the this object
  // eslint-disable-next-line no-underscore-dangle
  return `/catalog/book/${this._id}`;
});

// Export model
module.exports = mongoose.model('Book', BookSchema);
