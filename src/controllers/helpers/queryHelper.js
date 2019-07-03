/**
 * Checks if an object is null, undefined or whitespace.
 * @param {Object} obj
 */
export const undefinedNullOrEmpty = obj => {
  if (obj === null || obj === undefined || obj.trim() === '') return true;
  return false;
};

/**
 * Creates an object to filter Mongoose queries based on the parameters passed in the Request.query
 * @param {Request.query} urlQuery
 */
export const mongooseQueryBuilderForFilter = urlQuery => {
  const query = {};
  // add a filter for name
  if (!undefinedNullOrEmpty(urlQuery.name)) query.name = urlQuery.name;

  // add filters for skills -> matches primary skill area ids
  // user can pass in a list of ids separated via commas, split them and trim all whitespace
  if (!undefinedNullOrEmpty(urlQuery.primarySkillAreas))
    query.primarySkillAreas = {
      $in: urlQuery.primarySkillAreas.split(',').map(e => e.trim())
    };
  if (!undefinedNullOrEmpty(urlQuery.secondarySkillAreas))
    query.secondarySkillAreas = {
      $in: urlQuery.secondarySkillAreas.split(',').map(e => e.trim())
    };

  // add filters for cost
  if (!undefinedNullOrEmpty(urlQuery.minCost)) query['cost.minCost'] = urlQuery.minCost;
  if (!undefinedNullOrEmpty(urlQuery.maxCost)) query['cost.maxCost'] = urlQuery.maxCost;
  if (!undefinedNullOrEmpty(urlQuery.currency))
    query['cost.currency'] = urlQuery.currency.toUpperCase();
  if (
    !undefinedNullOrEmpty(urlQuery.groupPricingAvailable) &&
    (urlQuery.groupPricingAvailable.trim().toLowerCase() === 'true' ||
      urlQuery.groupPricingAvailable.trim().toLowerCase() === 'false')
  )
    query['cost.groupPricingAvailable'] = urlQuery.groupPricingAvailable === 'true';

  // add filters for location
  if (!undefinedNullOrEmpty(urlQuery.country)) query['location.country'] = urlQuery.country;
  if (!undefinedNullOrEmpty(urlQuery.province)) query['location.province'] = urlQuery.province;
  if (!undefinedNullOrEmpty(urlQuery.city)) query['location.city'] = urlQuery.city;

  // add filters for deliveryMethod
  if (!undefinedNullOrEmpty(urlQuery.deliveryMethod))
    query.deliveryMethod = urlQuery.deliveryMethod;

  // add filters for pdsa tier
  if (!undefinedNullOrEmpty(urlQuery.startingPdsaTier))
    query.startingPdsaTier = urlQuery.startingPdsaTier;

  // add filters for visibility
  if (!undefinedNullOrEmpty(urlQuery.visible)) query.visible = urlQuery.visible === 'true';

  // add filters for institution and program
  if (!undefinedNullOrEmpty(urlQuery.institution))
    query.institution = mongoose.Types.ObjectId(urlQuery.institution);
  if (!undefinedNullOrEmpty(urlQuery.program))
    query.program = mongoose.Types.ObjectId(urlQuery.program);

  // Filter via dates
  if (!undefinedNullOrEmpty(urlQuery.startDate) && !undefinedNullOrEmpty(urlQuery.endDate)) {
    const startDate = new Date(urlQuery.startDate);
    const endDate = new Date(urlQuery.endDate);

    query['notableDates.start'] = {
      $gte: startDate,
      $lte: endDate
    };

    query['notableDates.end'] = {
      $gte: startDate,
      $lte: endDate
    };
  }

  return Object.entries(query).length > 0 ? query : null;
};
