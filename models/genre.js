const mongoose = require('mongoose');

const { Schema } = mongoose;

const GenreSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
});

// Virtual for genre's URL
GenreSchema.virtual('url').get(function handler() {
  // We don't use an arrow function as we'll need the this object
  // eslint-disable-next-line no-underscore-dangle
  return `/catalog/genre/${this._id}`;
});

// Export model
module.exports = mongoose.model('Genre', GenreSchema);
