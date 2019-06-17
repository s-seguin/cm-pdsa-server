import mongoose from 'mongoose';

/**
 * This is the main schema to hold generic PDSA Item Details. Catherine specified the types that are available and we are creating new schemas for the non-generic types.
 * It holds all the common fields that are shared across the PDSA items as per the Excel sheet provided by Catherine.
 *
 * name: The name of the PDSA item, ex: 'Test Book about Development'
 *
 * primarySkillArea: A reference to the PrimarySkillArea Schema you want associated with this item (must already exist)
 *
 * secondarySkillArea: A reference to the SecondarySkillArea Schema you want associated with this item (must already exist)
 *
 * url: A link to the items website or any useful URL.
 *
 * startingPdsaTier: The first tier at which this Pdsa item is available as specified by HR
 *
 * cost: An object to specify the cost of the object
 *       Specify the currency due to the different locations
 *       minCost and maxCost in case there is different options (set to same if fixed price)
 *       groupPricingAvailable to indicate if there is a group discount
 *
 *  previousAttendees: A list of the names of previous CM employees that attended / bought
 *
 *  reviews: Reviews of the item by prev employess. Includes rating out of 5, review and the user who reviewed it
 *
 *  comments: any additional comments
 *
 *  additionalFields: ### STILL BEING TESTED ### If the PDSA item requires addition fields, for example a Book would have an Author field ex:
 *                    additionalFields: {
 *                       author: "Jane Doe"
 *                    }
 * */

const pdsaItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  primarySkillArea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PrimarySkillArea',
    required: true
  },
  secondarySkillArea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SecondarySkillArea',
    required: true
  },
  url: { type: String, required: true },
  startingPdsaTier: { type: Number, required: true },
  cost: {
    currency: { type: String, required: true },
    minCost: { type: Number, required: true },
    maxCost: { type: Number, required: true },
    groupPricingAvailable: { type: Boolean, required: true }
  },
  previousAttendees: [String],
  reviews: [
    {
      rating: Number,
      review: String,
      reviewedBy: String
    }
  ],
  comments: String,
  additionalFields: {}
});

const PdsaItem = mongoose.model('PdsaItem', pdsaItemSchema);

export default PdsaItem;
