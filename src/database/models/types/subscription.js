import mongoose from 'mongoose';
import PdsaItem from '../pdsaItem';

/**
 * This is the schema to hold a subscription PDSA item in the database.
 * It is a discriminant of PdsaItem meaning it inherits all of PdsaItem's properties with additional properties listed below.
 *
 * educationalInstitution: The institution offering the certification. E.g. 'University of Calgary'
 *
 * deliverMethod: How is this delivered to the users? Options ('Online', 'InClass', 'Both')
 *
 * duration: The duration of the subscription. E.g. 1 year
 *
 * ongoing: Is the subscription ongoing?
 */
const Subscription = PdsaItem.discriminator(
  'Subscription',
  new mongoose.Schema({
    educationalInstitution: String,
    deliveryMethod: String,
    duration: String,
    ongoing: Boolean
  })
);

export default Subscription;
