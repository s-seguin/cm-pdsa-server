import mongoose from 'mongoose';
import PdsaItem from '../pdsaItem';

const Subscription = PdsaItem.discriminator(
  'Subscription',
  new mongoose.Schema({
    educationalInstitution: String,
    onlineOrInClass: String,
    location: String,
    duration: String,
    ongoing: Boolean
  })
);

export default Subscription;
