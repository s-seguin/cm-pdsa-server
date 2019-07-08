import mongoose from 'mongoose';
import SecondarySkillArea from '../../database/models/metadata/secondarySkillArea';
import PrimarySkillArea from '../../database/models/metadata/primarySkillArea';
/**
 * Checks if an object is null, undefined or whitespace.
 * @param {Object} obj
 */
export const undefinedNullOrEmpty = obj => {
  if (obj === null || obj === undefined || obj.trim() === '') return true;
  return false;
};

/**
 * Return an array of all the ids where SecondarySkillArea names (via text index) match the searchQuery
 *
 * @param {String} searchQuery the query we are comparing our SecondarySkillAreas names too
 */
export const searchSecondarySkills = async searchQuery => {
  const matchingSecondarySkillIds = await SecondarySkillArea.find({
    $text: { $search: searchQuery }
  }).select('_id');

  return matchingSecondarySkillIds.map(o => o._id);
};

/**
 * Return an array of all the ids where PrimarySkillArea names (via text index) match the searchQuery
 *
 * @param {String} searchQuery the query we are comparing our PrimarySkillArea names too
 */
export const searchPrimarySkills = async searchQuery => {
  const matchingPrimarySkillIds = await PrimarySkillArea.find({
    $text: { $search: searchQuery }
  }).select('_id');

  console.log(matchingPrimarySkillIds);
  return matchingPrimarySkillIds.map(o => o._id);
};

/**
 * Creates an object to filter Mongoose queries based on the parameters passed in the Request.query
 * @param {Request.query} urlQuery
 */
export const createFilterForMongooseQuery = async urlQuery => {
  const query = {};
  let searching = false;
  const searchQ = { $or: [] };

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

  // add a filter for search results
  // if searching and primary skill area and secondary skill areas aren't set, search across all three
  // else search across name and unset skill areas
  // query is an OR -> Get all items where name matches search OR primarySkillAreas matches search OR secondarySkillAreas matches search
  if (!undefinedNullOrEmpty(urlQuery.search)) {
    searching = true;

    // add name to search query (uses text index)
    searchQ.$or.push({ $text: { $search: urlQuery.search } });

    // add primary skills if we aren't filtering by them already
    if (!query.primarySkillAreas) {
      const matchingPrimarySkillIds = await searchPrimarySkills(urlQuery.search);
      searchQ.$or.push({
        primarySkillAreas: {
          $in: matchingPrimarySkillIds
        }
      });
    }

    // add secondary skills if we aren't filtering by them already
    if (!query.secondarySkillAreas) {
      const matchingSecondarySkillIds = await searchSecondarySkills(urlQuery.search);
      searchQ.$or.push({
        secondarySkillAreas: {
          $in: matchingSecondarySkillIds
        }
      });
    }
  }

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

  console.log(JSON.stringify(query));

  if (searching && Object.entries(query).length > 0) {
    console.log(JSON.stringify({ $and: [query, searchQ] }));

    return { $and: [query, searchQ] };
  }
  if (searching) {
    console.log(JSON.stringify(searchQ));

    return searchQ;
  }
  return Object.entries(query).length > 0 ? query : null;
};
