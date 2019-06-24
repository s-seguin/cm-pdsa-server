import mongoose from 'mongoose';
import Program from './program';

/**
 * Institution is a schema to hold the various institutions offering Courses, Conferences, etc.
 *
 * We want to be able to quickly select and filter these so we are creating a schema to ensure they are all named correctly etc.
 */
const institutionSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

/**
 * Before an Institution is removed, remove all the Programs that are children of the specified Insitution (this._id)
 *
 * Simulates a On Delete Cascade functionality from SQL. Function is named an not an arrow function so that we can access 'this'
 */
institutionSchema.pre('remove', function cascadeDeleteChildren(next) {
  Program.deleteMany({ institution: this._id }, (err, res) => {
    if (err) next(`Error: ${err}`);
    else {
      console.log(res);
      next();
    }
  });
});

const Institution = mongoose.model('Institution', institutionSchema);

export default Institution;
