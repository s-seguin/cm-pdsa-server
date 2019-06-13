/**
 * An example Mongoose Schema then converted to a Schema. This is used for reference at later points.
 */
import mongoose from 'mongoose';

// Schemas and Models
const kittySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  age: Number
});

const Kitten = mongoose.model('Kitten', kittySchema);

export default Kitten;
