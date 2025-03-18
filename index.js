const express = require("express");
const app = express();
const { sequelize } = require("./lib/index.js");
const Author = require("./models/Author.js");
const Book = require("./models/Book.js");
const Genre = require("./models/Genre.js");
const PORT = 5000;

app.use(express.json());

app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    const authors = await Author.bulkCreate([
      {
        name: "J.K. Rowling",
        birthdate: "1965-07-31",
        email: "jkrowling@books.com",
      },
      {
        name: "George R.R. Martin",
        birthdate: "1948-09-20",
        email: "grrmartin@books.com",
      },
    ]);

    const genres = await Genre.bulkCreate([
      { name: "Fantasy", description: "Magical and mythical stories." },
      {
        name: "Drama",
        description: "Fiction with realistic characters and events.",
      },
    ]);

    const books = await Book.bulkCreate([
      {
        title: "Harry Potter and the Philosopher's Stone",
        description: "A young wizard's journey begins.",
        publicationYear: 1997,
        authorId: authors[0].id,
      },
      {
        title: "Game of Thrones",
        description: "A medieval fantasy saga.",
        publicationYear: 1996,
        authorId: authors[1].id,
      },
    ]);

    await books[0].setGenres([genres[0]]);
    await books[1].setGenres([genres[0], genres[1]]);

    return res.status(200).json({ message: "Database seeded successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in seeding data.", error: error.message });
  }
});

async function getallBooks() {
  const books = await Book.findAll();
  return { books: books };
}

app.get("/books", async (req, res) => {
  try {
    const response = await getallBooks();
    if (response.books.length === 0) {
      return res.status(404).json({ message: "Books not found." });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in fetching book data.", error: error.message });
  }
});

async function getBooksByAuthor(authorId) {
  const books = await Book.findAll({ where: { authorId } });
  return { books: books };
}

app.get("/authors/:authorId/books", async (req, res) => {
  try {
    const authorId = req.params.authorId;
    const response = await getBooksByAuthor(authorId);

    if (response.books.length === 0) {
      return res
        .status(404)
        .json({ message: `Books not found by authorID: {authorId}` });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: "Error in fetching book data by given author",
      error: error.message,
    });
  }
});

async function getBooksByGenre(genreId) {
  const books = await Book.findAll({
    include: {
      model: Genre,
      where: { id: genreId },
      attributes: [],
    },
  });
  return { books: books };
}

app.get("/genres/:genreId/books", async (req, res) => {
  try {
    const genreId = req.params.genreId;
    const response = await getBooksByGenre(genreId);

    if (response.books.length === 0) {
      return res
        .status(404)
        .json({ message: `Books not found by genreID: {genreId}` });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: "Error in fetching book data by given genre",
      error: error.message,
    });
  }
});

async function addNewBook(
  title,
  description,
  publicationYear,
  authorId,
  genreIds
) {
  const newBook = await Book.create({
    title,
    description,
    publicationYear,
    authorId,
  });

  if (genreIds.length > 0) {
    await newBook.setGenres(genreIds);
  }

  return {
    message: "Book added successfully",
    book: newBook,
  };
}

app.post("/books", async (req, res) => {
  try {
    const { title, description, publicationYear, authorId, genreIds } =
      req.body;

    const response = await addNewBook(
      title,
      description,
      publicationYear,
      authorId,
      genreIds
    );

    if (!response.message) {
      return res.status(404).json({ message: `Book not found` });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: "Error adding book",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
