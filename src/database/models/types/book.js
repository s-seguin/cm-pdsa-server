import mongoose from 'mongoose';
import PdsaItem from '../pdsaItem';

/**
 * This is the schema to hold a book PDSA item in the database.
 * It is a discriminant of PdsaItem meaning it inherits all of PdsaItem's properties with additional properties listed below.
 *
 * author: The author of the book, this is not required as many of the books in the spreadsheet provided do not have authors.
 *
 * publisher: This is the publisher or Educational Institution behind the book. In the spreadsheet it is listed as Educational Institution.
 */
const Book = PdsaItem.discriminator(
  'Book',
  new mongoose.Schema({
    author: String,
    publisher: String
  })
);

export default Book;
