/**
 * Check to make sure that an array isn't empty
 * @param {Array} arr
 */
const notEmptyArrayValidator = arr => {
  if (arr.length <= 0) return false;
  return true;
};

/**
 * Check to make sure the array of Primary or Secondary skill areas does not contain duplicate entries
 * @param {Array} arr
 */
const noDuplicateValues = arr => {
  for (let i = 0; i < arr.length; i += 1) {
    for (let j = i + 1; j < arr.length; j += 1) {
      if (JSON.stringify(arr[i]) === JSON.stringify(arr[j])) return false;
    }
  }
  return true;
};

export const primarySkillAreaReferenceValidator = [
  {
    validator: noDuplicateValues,
    msg: 'The supplied array of PrimarySkillArea References cannot contain duplicate entries.'
  }
];

// The validator for skill areas arrays
export const arrayValidator = [
  { validator: notEmptyArrayValidator, msg: 'The supplied arrays of Skill Areas cannot be empty.' },
  {
    validator: noDuplicateValues,
    msg: 'The supplied array of Skill Areas cannot contain duplicate entries.'
  }
];

// //////////////////////// //
// DELIVER METHOD VALIDATOR //
// //////////////////////// //
/** Custom validator to ensure the deliver method is either online, in-class, both
 * [0] -> the function to validate the delivery method
 * [1] -> the error message is the validation is unsuccessful
 */
export const deliveryMethodValidator = [
  deliveryMethod => {
    if (!['online', 'in-class', 'both'].includes(deliveryMethod)) return false;
    return true;
  },
  'Invalid delivery method. Delivery Method can be online, in-class or both'
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
 * @param {Cost} cost the cost object to check
 */
const validCurrencyCodeValidator = cost => {
  if (!currencyCodes.includes(cost.currency)) return false;
  return true;
};

/**
 * Checks that both the min cost and max cost are greater than zero
 * @param {Cost} cost the cost object to check
 */
const costGreaterThanZeroValidator = cost => {
  if (cost.minCost < 0 || cost.maxCost < 0) return false;
  return true;
};

/**
 * Checks that the min cost is less than the max cost
 * @param {Cost} cost the cost object to check
 */
const minCostLessThanMaxCostValidator = cost => {
  if (cost.maxCost < cost.minCost) return false;
  return true;
};

/**
 * Check that the provided min and max costs are numbers.
 * @param {Cost} cost
 */
const costIsNumber = cost => {
  if (typeof cost.minCost === 'number' && typeof cost.maxCost === 'number') return true;
  return false;
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
  },
  {
    validator: costIsNumber,
    msg: 'The provided min and max costs must be numbers.'
  }
];

/**
 * Check and make sure that the start date is before or equal to the end date
 * @param {Object} dates
 */
const startDateBeforeEndDate = dates => {
  const start = new Date(dates.start);
  const end = new Date(dates.end);

  if (start > end) return false;
  return true;
};

export const dateValidator = [
  { validator: startDateBeforeEndDate, msg: 'Start date must be before or equal to end date.' }
];
