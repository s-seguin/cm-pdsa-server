/** Custom validator to ensure PDSA Tier is a number between 1-4
 * [0] -> the function to validate the pdsaTier
 * [1] -> the error message is the validation is unsuccessful
 */
export const deliveryMethodValidator = [
  deliverMethod => {
    if (['Online', 'InClass', 'Both'].includes(deliverMethod)) return false;
    return true;
  },
  'Invalid delivery method. Delivery Method can be Online, InClass or Both'
];

// ////////// //
// Validation //
// ////////// //

/** Custom validator to ensure PDSA Tier is a number between 1-4
 * [0] -> the function to validate the pdsaTier
 * [1] -> the error message is the validation is unsuccessful
 */
export const pdsaTierValidator = [
  pdsaTier => {
    if (pdsaTier < 1 || pdsaTier > 4) return false;
    return true;
  },
  'Invalid PDSA Tier. PDSA Tier must be one of the following: 1,2,3,4.'
];

const currencyCodes = ['CAD', 'USD', 'EUR', 'GBP', 'HKD', 'CRC'];
const validCurrencyCodeValidator = cost => {
  if (!currencyCodes.includes(cost.currency)) return false;
  return true;
};

const costGreaterThanZeroValidator = cost => {
  if (cost.minCost < 0 || cost.maxCost < 0) return false;
  return true;
};

const minCostLessThanMaxCostValidator = cost => {
  if (cost.maxCost < cost.minCost) return false;
  return true;
};

export const costValidator = [
  { validator: costGreaterThanZeroValidator, msg: 'The cost of an item cannot be less than 0.' },
  {
    validator: minCostLessThanMaxCostValidator,
    msg: 'The max cost of an item must be greater than the min cost'
  },
  {
    validator: validCurrencyCodeValidator,
    msg: 'The currency must be specified using a currency code. e.g. CAD for Canadian Dollars'
  }
];
