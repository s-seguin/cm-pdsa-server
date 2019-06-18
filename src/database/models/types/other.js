import mongoose from 'mongoose';
import PdsaItem from '../pdsaItem';

const Other = PdsaItem.discriminator(
  'Other',
  new mongoose.Schema({
    educationalInstitution: String,
    programName: String,
    onlineOrInClass: String,
    location: String,
    notableDates: [Date],
    ongoing: Boolean
  })
);

export default Other;
