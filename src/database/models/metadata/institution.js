import mongoose from 'mongoose';
import Program from './program';

/**
 * Institution is a schema to hold the various institutions offering Courses, Conferences, etc.
 *
 * We want to be able to quickly select and filter these so we are creating a schema to ensure they are all named correctly etc.
 */
const institutionSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }
});

const Institution = mongoose.model('Institution', institutionSchema);

export default Institution;
