import mongoose from 'mongoose';
import { primarySkillAreaReferenceValidator } from '../validation';

/**
 * A schema to hold the Secondary Skill Areas that PDSA items an be a part of e.g. Leadership and Development, Human Resources
 *
 * The reference to parentPrimarySkillArea is because the secondary skills belong to a primary skill.
 */
const secondarySkillAreaSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  primarySkillAreaReferences: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PrimarySkillArea',
        required: true
      }
    ],
    validate: primarySkillAreaReferenceValidator
  }
});

/**
 * Check if there exists a SecondarySkillArea with the same name and parentPrimarySkillArea
 */
secondarySkillAreaSchema.pre('save', async function ensureUnique(next) {
  // we need to disable this rule because the hooks need to be defined before our model is created.
  // eslint-disable-next-line no-use-before-define
  const items = await SecondarySkillArea.find({
    name: this.name,
    parentPrimarySkillArea: this.parentPrimarySkillArea
  });

  if (items.length > 0)
    return next(
      `Duplicate entry. There is already a SecondarySkillArea with name: ${this.name} and parentPrimarySkillArea: ${this.parentPrimarySkillArea}`
    );
  return next();
});

secondarySkillAreaSchema.index({ name: 'text' });
const SecondarySkillArea = mongoose.model('SecondarySkillArea', secondarySkillAreaSchema);

export default SecondarySkillArea;
