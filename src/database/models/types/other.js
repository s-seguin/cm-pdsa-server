import mongoose from 'mongoose';
import PdsaItem from '../pdsaItem';
import { deliveryMethodValidator } from '../validation';

/**
 * This is the schema to hold a Generic PDSA item in the database.
 * It is a discriminant of PdsaItem meaning it inherits all of PdsaItem's properties with additional properties listed below.
 *
 * This is for items that don't fit in the other PdsaItem discriminants and require properties not found in PdsaItem.
 *
 * educationalInstitution: The institution offering the certification. E.g. 'University of Calgary'
 *
 * programName: The name of the program that the course is working towards if applicable
 *
 * deliverMethod: How is this delivered to the users? Options ('Online', 'InClass', 'Both')
 *
 * location: If deliveryMethod is inclass or both, where is it offered?
 *
 * duration: How long will this last?
 *
 * notableDates: An object to hold start and end dates, or any other note worthy dates.
 *
 * ongoing: Is this ongoing?
 */

const Other = PdsaItem.discriminator(
  'Other',
  mongoose.Schema({
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: false
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: false
    },
    deliveryMethod: { type: String, validate: deliveryMethodValidator },
    location: String,
    duration: String,
    notableDates: { start: Date, end: Date, otherDates: [Date] },
    ongoing: Boolean
  })
);

export default Other;
