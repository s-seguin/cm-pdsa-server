import mongoose from 'mongoose';
import PdsaItem from '../pdsaItem';

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
    educationInstitution: String,
    deliveryMethod: String, // 'Online', 'InClass', 'Both'
    location: String,
    ongoing: Boolean
  })
);

export default Certification;
