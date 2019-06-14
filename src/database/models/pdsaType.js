import mongoose from 'mongoose';

const pdsaTypeSchema = mongoose.Schema({
  name: String
});

const PdsaType = mongoose.model('PdsaType', pdsaTypeSchema);

export default PdsaType;
