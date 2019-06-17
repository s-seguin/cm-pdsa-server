import mongoose from 'mongoose';

/**
 * A schema to hold the Secondary Skill Areas that PDSA items an be a part of e.g. Leadership and Development, Human Resources
 *
 * Primary and Secondary skills appear to be two separate list thus the two separate schemas.
 */
const secondarySkillAreaSchema = mongoose.Schema({
  name: String
});

const SecondarySkillArea = mongoose.model('SecondarySkillArea', secondarySkillAreaSchema);

export default SecondarySkillArea;
