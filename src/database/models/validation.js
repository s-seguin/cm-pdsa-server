// //////////////////////// //
// DELIVER METHOD VALIDATOR //
// //////////////////////// //
/** Custom validator to ensure PDSA Tier is a number between 1-4
 * [0] -> the function to validate the pdsaTier
 * [1] -> the error message is the validation is unsuccessful
 */
export const deliveryMethodValidator = [
  deliverMethod => {
    if (['online', 'in-class', 'both'].includes(deliverMethod)) return false;
    return true;
  },
  'Invalid delivery method. Delivery Method can be Online, InClass or Both'
];

// /////////////////// //
// PDSA TIER VALIDATOR //
// /////////////////// //
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

// ////////////////// //
// CURRENCY VALIDATOR //
// ////////////////// //
// Currency codes used in the new CM Learn site
const currencyCodes = ['CAD', 'USD', 'EUR', 'GBP', 'HKD', 'CRC', 'BRL', 'JPY'];

/**
 * Checks if the currency specified in the Cost is a valid currency code specified above
 * @param {*} cost the cost object to check
 */
const validCurrencyCodeValidator = cost => {
  if (!currencyCodes.includes(cost.currency)) return false;
  return true;
};

/**
 * Checks that both the min cost and max cost are greater than zero
 * @param {*} cost
 */
const costGreaterThanZeroValidator = cost => {
  if (cost.minCost < 0 || cost.maxCost < 0) return false;
  return true;
};

/**
 * Checks that the min cost is less than the max cost
 * @param {*} cost
 */
const minCostLessThanMaxCostValidator = cost => {
  if (cost.maxCost < cost.minCost) return false;
  return true;
};

/**
 * A group of validators to check the cost object of a PDSA item
 */
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
