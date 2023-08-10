const asyncHandler = require('express-async-handler');
const Genre = require('../models/genre');
const Book = require('../models/book');

// Display list of all Authors.
exports.genre_list = asyncHandler(async (req, res) => {
  const allGenre = await Genre.find().sort({ name: 1 }).exec();
  res.render('genre_list', {
    title: 'Genre List',
    genre_list: allGenre,
  });
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  // Get details of genre and all associated books (in parallel)
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, 'title summary').exec(),
  ]);
  if (genre === null) {
    // No results.
    const err = new Error('Genre not found');
    err.status = 404;
    next(err);
  } else {
    res.render('genre_detail', {
      title: 'Genre Detail',
      genre,
      genre_books: booksInGenre,
    });
  }
});

// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res) => {
  res.send('NOT IMPLEMENTED: Genre create GET');
});

// Handle Genre create on POST.
exports.genre_create_post = asyncHandler(async (req, res) => {
  res.send('NOT IMPLEMENTED: Genre create POST');
});

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res) => {
  res.send('NOT IMPLEMENTED: Genre delete GET');
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res) => {
  res.send('NOT IMPLEMENTED: Genre delete POST');
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res) => {
  res.send('NOT IMPLEMENTED: Genre update GET');
});

// Handle Genre update on POST.
exports.genre_update_post = asyncHandler(async (req, res) => {
  res.send('NOT IMPLEMENTED: Genre update POST');
});
