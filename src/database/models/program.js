import mongoose from 'mongoose';

/**
 * A schema to hold the Primary Skill Areas that PDSA items an be a part of e.g. Leadership and Development, Human Resources
 *
 * Primary and Secondary skills appear to be two separate list thus the two separate schemas.
 */
const programSchema = mongoose.Schema({
  name: { type: String, required: true },
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true
  }
});

const Program = mongoose.model('Program', programSchema);

export default Program;
