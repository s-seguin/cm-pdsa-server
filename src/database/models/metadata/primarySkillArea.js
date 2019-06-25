import mongoose from 'mongoose';
import SecondarySkillArea from './secondarySkillArea';

/**
 * A schema to hold the Primary Skill Areas that PDSA items an be a part of e.g. Leadership and Development, Human Resources
 *
 * Primary and Secondary skills appear to be two separate list thus the two separate schemas.
 */
const primarySkillAreaSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

/**
 * Before an PrimarySkillArea is removed, remove all the SecondarySkillAreas that are children of the specified PrimarySkillArea (this._id)
 *
 * Simulates a On Delete Cascade functionality from SQL. Function is named an not an arrow function so that we can access 'this'
 */
primarySkillAreaSchema.pre('remove', async function cascadeDeleteChildren(next) {
  // Cascade delete all SecondarySkillAreas that belong to the primary Skill Areas
  try {
    const deleteChildrenRes = await SecondarySkillArea.deleteMany({
      parentPrimarySkillArea: this._id
    });
    console.log(deleteChildrenRes);
    next();
  } catch (e) {
    next(`Error: ${e}`);
  }
});

const PrimarySkillArea = mongoose.model('PrimarySkillArea', primarySkillAreaSchema);

export default PrimarySkillArea;
