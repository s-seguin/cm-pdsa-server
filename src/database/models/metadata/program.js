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

/**
 * Check if there exists a Program with the same name and institution
 */
programSchema.pre('save', async function ensureUnique(next) {
  // we need to disable this rule because the hooks need to be defined before our model is created.
  // eslint-disable-next-line no-use-before-define
  const items = await Program.find({
    name: this.name,
    institution: this.institution
  });

  if (items.length > 0)
    return next(
      `Duplicate entry. There is already a Program with name: ${this.name} and institution: ${this.institution}`
    );
  return next();
});

const Program = mongoose.model('Program', programSchema);

export default Program;
