import mongoose from 'mongoose';
import PdsaItem from '../pdsaItem';

const Book = PdsaItem.discriminator(
  'Book',
  new mongoose.Schema({
    author: String,
    publisher: String
  })
);

export default Book;
