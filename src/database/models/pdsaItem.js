import mongoose from 'mongoose';

const pdsaItemSchema = mongoose.Schema({
  pdsaType: { type: mongoose.Schema.Types.ObjectId, ref: 'PdsaType' },
  name: String,
  //   primarySkillArea: { type: mongoose.Schema.Types.ObjectId, ref: 'PrimarySkillArea' },
  //   secondarySkillArea: { type: mongoose.Schema.Types.ObjectId, ref: 'SecondarySkillArea' },
  url: String,
  startingPdsaTier: Number,
  cost: {
    currency: String,
    minCost: Number,
    maxCost: Number,
    groupPricingAvailable: Boolean
  },
  previousAttendees: [String],
  reviews: [
    {
      rating: Number,
      review: String
    }
  ],
  comments: String,
  additionalFields: {}
});

const PdsaItem = mongoose.model('PdsaItem', pdsaItemSchema);

export default PdsaItem;
