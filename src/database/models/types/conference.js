import mongoose from 'mongoose';
import PdsaItem from '../pdsaItem';

const Conference = PdsaItem.discriminator(
  'Conference',
  new mongoose.Schema({
    educationalInstitution: String,
    onlineOrInClass: String,
    location: String,
    notableDates: [Date],
    ongoing: Boolean
  })
);

export default Conference;
