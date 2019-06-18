import mongoose from 'mongoose';
import PdsaItem from '../pdsaItem';

const Certification = PdsaItem.discriminator(
  'Certification',
  new mongoose.Schema({
    educationInstitution: String,
    onlineOrInClass: String,
    ongoing: Boolean
  })
);

export default Certification;
