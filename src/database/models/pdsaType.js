import mongoose from 'mongoose';

/**
 * A schema to keep track of the different types of PDSA items available (e.g. Book, Seminar, Conference)
 *
 * This allows us to easily rename a type, add additional types, and ensure that all PDSA items of the same type use the same spelling.
 */
const pdsaTypeSchema = mongoose.Schema({
  name: { type: String, required: true }
});

const PdsaType = mongoose.model('PdsaType', pdsaTypeSchema);

export default PdsaType;
