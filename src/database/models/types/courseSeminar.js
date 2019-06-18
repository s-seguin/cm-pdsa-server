import mongoose from 'mongoose';
import PdsaItem from '../pdsaItem';

const CourseSeminar = PdsaItem.discriminator(
  'CourseSeminar',
  new mongoose.Schema({
    educationalInstitution: String,
    programName: String,
    onlineOrInClass: String,
    location: String,
    notableDates: [Date],
    ongoing: Boolean
  })
);

export default CourseSeminar;
