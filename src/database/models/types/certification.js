import mongoose from 'mongoose';
import PdsaItem from '../pdsaItem';
import { deliveryMethodValidator } from '../validation';

/**
 * This is the schema to hold a certification PDSA item in the database.
 * It is a discriminant of PdsaItem meaning it inherits all of PdsaItem's properties with additional properties listed below.
 *
 * educationalInstitution: The institution offering the certification. E.g. 'University of Calgary'
 *
 * deliverMethod: How is this delivered to the users? Options ('Online', 'InClass', 'Both')
 *
 * location: If deliveryMethod is inclass or both, where is it offered?
 *
 * ongoing: Is the certification ongoing?
 */
const Certification = PdsaItem.discriminator(
  'Certification',
  new mongoose.Schema({
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: false
    },
    deliveryMethod: { type: String, validate: deliveryMethodValidator }, // 'Online', 'InClass', 'Both'
    location: String,
    ongoing: Boolean
  })
);

export default Certification;
