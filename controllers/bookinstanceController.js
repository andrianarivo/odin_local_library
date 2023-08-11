const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');

// Display list of all BookInstances.
exports.bookinstance_list = asyncHandler(async (req, res) => {
  const allBookInstances = await BookInstance.find().populate('book').exec();

  res.render('bookinstance_list', {
    title: 'Book Instance List',
    bookinstance_list: allBookInstances,
  });
});

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate('book')
    .exec();

  if (bookInstance === null) {
    // No results.
    const err = new Error('Book copy not found');
    err.status = 404;
    next(err);
  } else {
    res.render('bookinstance_detail', {
      title: 'Book:',
      bookinstance: bookInstance,
    });
  }
});

// Display BookInstance create form on GET.
exports.bookinstance_create_get = asyncHandler(async (req, res) => {
  const allBooks = await Book.find({}, 'title').exec();

  res.render('bookinstance_form', {
    title: 'Create BookInstance',
    book_list: allBooks,
  });
});

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  // Validate and sanitize fields.
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('status').escape(),
  body('due_back', 'Invalid date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allBooks = await Book.find({}, 'title').exec();

      res.render('bookinstance_form', {
        title: 'Create BookInstance',
        book_list: allBooks,
        // eslint-disable-next-line no-underscore-dangle
        selected_book: bookInstance.book._id,
        errors: errors.array(),
        bookinstance: bookInstance,
      });
    } else {
      // Data from form is valid
      await bookInstance.save();
      res.redirect(bookInstance.url);
    }
  }),
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = asyncHandler(async (req, res) => {
  // Get details of author and all their books (in parallel)
  const bookinstance = await BookInstance.findById(req.params.id).populate('book').exec();

  if (!bookinstance) {
    // No results.
    res.redirect('/catalog/bookinstances');
  }

  res.render('bookinstance_delete.ejs', {
    title: 'Delete Book Instance',
    bookinstance,
  });
});

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = asyncHandler(async (req, res) => {
  // Get details of author and all their books (in parallel)
  const bookinstance = await BookInstance.findById(req.params.id).exec();

  if (bookinstance === null) {
    // No results.
    res.redirect('/catalog/bookinstances');
  } else {
    // Delete object and redirect to the list of book instances.
    await BookInstance.findByIdAndRemove(req.body.bookinstanceid);
    res.redirect('/catalog/bookinstances');
  }
});

// Display BookInstance update form on GET.
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
  const [bookInstance, allBooks] = await Promise.all([
    BookInstance.findById(req.params.id).exec(),
    Book.find({}).exec(),
  ]);

  if (bookInstance === null) {
    // No results.
    const err = new Error('Genre not found');
    err.status = 404;
    next(err);
  } else {
    res.render('bookinstance_form', {
      title: 'Update Book Instance',
      // eslint-disable-next-line no-underscore-dangle
      selected_book: bookInstance.book._id,
      bookinstance: bookInstance,
      book_list: allBooks,
    });
  }
});

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
  // Validate and sanitize fields.
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('status').escape(),
  body('due_back', 'Invalid date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allBooks = await Book.find({}, 'title').exec();

      res.render('bookinstance_form', {
        title: 'Create BookInstance',
        book_list: allBooks,
        // eslint-disable-next-line no-underscore-dangle
        selected_book: bookInstance.book._id,
        errors: errors.array(),
        bookinstance: bookInstance,
      });
    } else {
      // Data from form is valid
      const updatedBookInstance = await BookInstance.findByIdAndUpdate(
        { _id: req.params.id },
        bookInstance,
        {},
      );
      res.redirect(updatedBookInstance.url);
    }
  }),
];
