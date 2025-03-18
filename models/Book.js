let { sequelize, DataTypes } = require("../lib/index.js");
let Author = require("./Author.js");
let Genre = require("./Genre.js");

let Book = sequelize.define("Book", {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  publicationYear: DataTypes.INTEGER,
  authorId: DataTypes.INTEGER,
});

// Associations
Author.hasMany(Book, { foreignKey: "authorId" });
Book.belongsTo(Author, {
  foreignKey: {
    name: "authorId",
    allowNull: false,
  },
}); // One book belongs to one author

Book.belongsToMany(Genre, { through: "BookGenres" }); // Many-to-many relationship with Genre
Genre.belongsToMany(Book, { through: "BookGenres" }); // Many-to-many relationship with Book

module.exports = Book;
