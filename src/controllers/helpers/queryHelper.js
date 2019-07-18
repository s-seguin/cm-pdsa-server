import mongoose from 'mongoose';
import {
  getIdsOfSecondarySkillsMatchingSearch,
  getIdsOfPrimarySkillsMatchingSearch
} from './searchHelper';

/**
 * Checks if an object is null, undefined or whitespace.
 * @param {Object} obj
 */
export const undefinedNullOrEmpty = obj => {
  if (obj === null || obj === undefined || obj.trim() === '') return true;
  return false;
};

/**
 * From the parameter check if its a valid sort key, and transpose it to the corresponding sort key in the model. Else return null.
 * @param {String} itemName
 */
const getSortKey = itemName =>
  ({
    name: 'name',
    primary: 'primarySkillAreaSortKey',
    secondary: 'secondarySkillAreaSortKey'
  }[itemName] || null);

/**
 * From the parameter check if its a valid sort order, and transpose it to the corresponding sort order in mongoose. Else return null.
 * @param {String} itemName
 */
const getSortOrder = itemName =>
  ({
    asc: 1,
    desc: -1,
    '1': 1,
    '-1': -1
  }[itemName] || null);

/**
 * Reduce the sort query (after being split on ',') to a single object we can pass into Mongoose to sort.
 * @param {Object} acc The accumulated object we are building
 * @param {String} cur The current string which is a single sort query that we need to split and store as an object
 */
const createSortObject = (acc, cur) => {
  const params = cur.split(':');
  // ensure the passed in a key and an order
  // ensure they are valid
  if (params.length === 2) {
    const sortKey = getSortKey(params[0]);
    const sortOrder = getSortOrder(params[1]);

    // return the sort object
    if (sortKey && sortOrder) acc[sortKey] = sortOrder;
  }
  return acc;
};

/**
 * From the request.query object return they sort options
 *
 * Valid sort keys are: name, primary, secondary
 * Valid sort orders: 'asc', 'desc', 1, -1
 *
 * @param {Request.query} urlQuery
 */
export const createSortForMongooseQuery = urlQuery => {
  // check if they passed in sort params
  if (!undefinedNullOrEmpty(urlQuery.sort)) {
    const sortItems = urlQuery.sort.split(',');

    // Build an object with all the sort parameters, pass in an initial empty object to reduce the entire array
    const mongooseSort = sortItems.reduce(createSortObject, {});

    return Object.entries(mongooseSort).length > 0 ? mongooseSort : null;
  }
  return null;
};

/**
 * Creates an object to filter Mongoose queries based on the parameters passed in the Request.query
 * @param {Request.query} urlQuery
 */
export const createFilterForMongooseQuery = async urlQuery => {
  const mongooseQuery = {};
  let searching = false;
  const mongooseSearchQuery = { $or: [] };

  // add filters for skills -> matches primary skill area ids
  // user can pass in a list of ids separated via commas, split them and trim all whitespace
  if (!undefinedNullOrEmpty(urlQuery.primarySkillAreas))
    mongooseQuery.primarySkillAreas = {
      $in: urlQuery.primarySkillAreas.split(',').map(e => e.trim())
    };
  if (!undefinedNullOrEmpty(urlQuery.secondarySkillAreas))
    mongooseQuery.secondarySkillAreas = {
      $in: urlQuery.secondarySkillAreas.split(',').map(e => e.trim())
    };

  // add a filter for search results
  // if searching and primary skill area and secondary skill areas aren't set, search across all three
  // else search across name and unset skill areas
  // query is an OR -> Get all items where name matches search OR primarySkillAreas matches search OR secondarySkillAreas matches search
  if (!undefinedNullOrEmpty(urlQuery.search)) {
    searching = true;

    // add name to search query (uses text index)
    mongooseSearchQuery.$or.push({ $text: { $search: urlQuery.search } });

    // add primary skills if we aren't filtering by them already
    if (!mongooseQuery.primarySkillAreas) {
      const matchingPrimarySkillIds = await getIdsOfPrimarySkillsMatchingSearch(urlQuery.search);
      mongooseSearchQuery.$or.push({
        primarySkillAreas: {
          $in: matchingPrimarySkillIds
        }
      });
    }

    // add secondary skills if we aren't filtering by them already
    if (!mongooseQuery.secondarySkillAreas) {
      const matchingSecondarySkillIds = await getIdsOfSecondarySkillsMatchingSearch(
        urlQuery.search
      );
      mongooseSearchQuery.$or.push({
        secondarySkillAreas: {
          $in: matchingSecondarySkillIds
        }
      });
    }
  }

  // add filters for cost
  if (!undefinedNullOrEmpty(urlQuery.minCost)) mongooseQuery['cost.minCost'] = urlQuery.minCost;
  if (!undefinedNullOrEmpty(urlQuery.maxCost)) mongooseQuery['cost.maxCost'] = urlQuery.maxCost;
  if (!undefinedNullOrEmpty(urlQuery.currency))
    mongooseQuery['cost.currency'] = urlQuery.currency.toUpperCase();
  if (
    !undefinedNullOrEmpty(urlQuery.groupPricingAvailable) &&
    (urlQuery.groupPricingAvailable.trim().toLowerCase() === 'true' ||
      urlQuery.groupPricingAvailable.trim().toLowerCase() === 'false')
  )
    mongooseQuery['cost.groupPricingAvailable'] = urlQuery.groupPricingAvailable === 'true';

  // add filters for location
  if (!undefinedNullOrEmpty(urlQuery.location)) {
    const locations = urlQuery.location.split(',');
    mongooseQuery.$or = locations.map(l => {
      return { location: l.trim() };
    });
  }

  // add filters for deliveryMethod
  if (!undefinedNullOrEmpty(urlQuery.deliveryMethod))
    mongooseQuery.deliveryMethod = urlQuery.deliveryMethod;

  // add filters for pdsa tier
  if (!undefinedNullOrEmpty(urlQuery.startingPdsaTier))
    mongooseQuery.startingPdsaTier = urlQuery.startingPdsaTier;

  // add filters for visibility
  if (!undefinedNullOrEmpty(urlQuery.visible)) mongooseQuery.visible = urlQuery.visible === 'true';

  // add filters for institution and program
  if (!undefinedNullOrEmpty(urlQuery.institution))
    mongooseQuery.institution = mongoose.Types.ObjectId(urlQuery.institution);
  if (!undefinedNullOrEmpty(urlQuery.program))
    mongooseQuery.program = mongoose.Types.ObjectId(urlQuery.program);

  // Filter via dates
  if (!undefinedNullOrEmpty(urlQuery.startDate) && !undefinedNullOrEmpty(urlQuery.endDate)) {
    const startDate = new Date(urlQuery.startDate);
    const endDate = new Date(urlQuery.endDate);

    mongooseQuery['notableDates.start'] = {
      $gte: startDate,
      $lte: endDate
    };

    mongooseQuery['notableDates.end'] = {
      $gte: startDate,
      $lte: endDate
    };
  }

  // if we are searching and filtering, the query to return is searchQuery AND mongooseQuery
  if (searching && Object.entries(mongooseQuery).length > 0) {
    return { $and: [mongooseQuery, mongooseSearchQuery] };
  }
  // if we are only searching, just return the searchQuery
  if (searching) {
    return mongooseSearchQuery;
  }

  // otherwise, if we are not searching either return the filtered query or null
  return Object.entries(mongooseQuery).length > 0 ? mongooseQuery : null;
};
