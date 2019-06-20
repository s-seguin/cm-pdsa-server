import mongoose from 'mongoose';

/**
 * A schema to hold the Secondary Skill Areas that PDSA items an be a part of e.g. Leadership and Development, Human Resources
 *
 * The reference to parentPrimarySkillArea is because the secondary skills belong to a primary skill.
 */
const secondarySkillAreaSchema = mongoose.Schema({
  name: { type: String, required: true },
  parentPrimarySkillArea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PrimarySkillArea',
    required: true
  }
});

const SecondarySkillArea = mongoose.model('SecondarySkillArea', secondarySkillAreaSchema);

export default SecondarySkillArea;
