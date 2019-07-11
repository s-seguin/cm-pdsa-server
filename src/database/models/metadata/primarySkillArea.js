import mongoose from 'mongoose';
import SecondarySkillArea from './secondarySkillArea';

/**
 * A schema to hold the Primary Skill Areas that PDSA items an be a part of e.g. Leadership and Development, Human Resources
 *
 * Primary and Secondary skills appear to be two separate list thus the two separate schemas.
 */
const primarySkillAreaSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }
});

primarySkillAreaSchema.index({ name: 'text' });
const PrimarySkillArea = mongoose.model('PrimarySkillArea', primarySkillAreaSchema);

export default PrimarySkillArea;
