import mongoose from 'mongoose';

const secondarySkillAreaSchema = mongoose.Schema({
  name: String
});

const SecondarySkillArea = mongoose.model('SecondarySkillArea', secondarySkillAreaSchema);

export default SecondarySkillArea;
