import mongoose from 'mongoose';

const primarySkillAreaSchema = mongoose.Schema({
  name: String
});

const PrimarySkillArea = mongoose.model('PrimarySkillArea', primarySkillAreaSchema);

export default PrimarySkillArea;
