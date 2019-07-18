import mongoose from 'mongoose';
import PdsaItem from '../pdsaItem';
import { deliveryMethodValidator } from '../validation';

/**
 * This is the schema to hold a Course / Seminar PDSA item in the database.
 * It is a discriminant of PdsaItem meaning it inherits all of PdsaItem's properties with additional properties listed below.
 *
 * educationalInstitution: The institution offering the certification. E.g. 'University of Calgary'
 *
 * programName: The name of the program that the course is working towards if applicable
 *
 * deliverMethod: How is this delivered to the users? Options ('Online', 'InClass', 'Both')
 *
 * location: If deliveryMethod is inclass or both, where is it offered?
 *
 * notableDates: An object to hold start and end dates, or any other note worthy dates.
 *
 * ongoing: Is the course ongoing?
 */

const CourseSeminar = PdsaItem.discriminator(
  'CourseSeminar',
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
    notableDates: { start: Date, end: Date, otherDates: [Date] },
    ongoing: Boolean
  })
);

export default CourseSeminar;
