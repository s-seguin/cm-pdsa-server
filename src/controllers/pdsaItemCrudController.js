import PdsaItem from '../database/models/pdsaItem';
import Book from '../database/models/types/book';
import Subscription from '../database/models/types/subscription';
import Certification from '../database/models/types/certification';
import Conference from '../database/models/types/conference';
import CourseSeminar from '../database/models/types/courseSeminar';
import Other from '../database/models/types/other';
import {
  undefinedNullOrEmpty,
  createFilterForMongooseQuery,
  createSortForMongooseQuery
} from './helpers/queryHelper';
import PrimarySkillArea from '../database/models/metadata/primarySkillArea';
import SecondarySkillArea from '../database/models/metadata/secondarySkillArea';

/**
 * Return the match PdsaItem Model from the provided itemName, if it doesn't match anything return null
 * @param {String} itemName
 */
const getPdsaItemModel = itemName =>
  ({
    books: Book,
    subscriptions: Subscription,
    certifications: Certification,
    conferences: Conference,
    'course-seminars': CourseSeminar,
    other: Other,
    'pdsa-items': PdsaItem
  }[itemName] || null);

/**
 * Retrieve the skill area name for the provided ID
 *
 * @param {ObjectId} firstSkillArea
 */
const getPrimarySortKeyName = async firstSkillArea => {
  // check if they are updating the primary skill areas and update the sort key too
  const primarySkillArea = await PrimarySkillArea.findById(firstSkillArea);

  if (!primarySkillArea) {
    throw new Error(
      'At least one of the provided primary skill area references, does not reference an existing PrimarySkillArea.'
    );
  }

  return primarySkillArea.name;
};

/**
 * Retrieve the skill area name for the provided ID
 *
 * @param {ObjectId} firstSkillArea
 */
const getSecondarySortKeyName = async firstSkillArea => {
  // check if they are updating the secondary skill areas and update the sort key too
  const secondarySkillArea = await SecondarySkillArea.findById(firstSkillArea);

  if (!secondarySkillArea) {
    throw new Error(
      'At least one of the provided secondary skill area references, does not reference an existing SecondarySkillArea.'
    );
  }
  return secondarySkillArea.name;
};

/**
 * Creates a new PdsaItem to store in the DB from the JSON data passed in the req.body.
 *
 * This is a generic controller that looks at the PDSA type being requested through the url parameters
 *
 * @param {*} req the request object
 * @param {*} res the response object
 */
export const create = async (req, res) => {
  const ItemModel = getPdsaItemModel(req.params.type.toLowerCase());

  // We are a not allowed to create Generic PdsaItems, use type Other instead.
  if (ItemModel !== null && ItemModel !== PdsaItem) {
    try {
      // Add the sort keys to the item
      if (req.body.primarySkillAreas && req.body.primarySkillAreas.length > 0)
        req.body.primarySkillAreaSortKey = await getPrimarySortKeyName(
          req.body.primarySkillAreas[0]
        );
      if (req.body.secondarySkillAreas && req.body.secondarySkillAreas.length > 0)
        req.body.secondarySkillAreaSortKey = await getSecondarySortKeyName(
          req.body.secondarySkillAreas[0]
        );

      // we need to instantiate a new Object of type determined by the pdsaItemSwitch
      const instantiatedItem = new ItemModel(req.body);

      const result = await instantiatedItem.save();
      res.status(201).send(result);
    } catch (e) {
      res.status(500).send(`Error: ${e}`);
    }
  } else {
    res
      .status(400)
      .send(
        ItemModel !== PdsaItem
          ? `Error: Provided paramter :type was incorrect`
          : `Error: Provided paramter :type was incorrect. Do not try and create generic PdsaItems, use type Other instead.`
      );
  }
};

/**
 * Send the paginated results back to the client. They need to specify limit and page in the Request.query
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Mongoose Model} ItemModel
 */
export const sendPaginatedResults = async (req, res, ItemModel) => {
  try {
    const options = {
      populate: ['primarySkillAreas', 'secondarySkillAreas', 'program', 'institution'],
      sort: createSortForMongooseQuery(req.query)
    };
    if (!undefinedNullOrEmpty(req.query.page) && !undefinedNullOrEmpty(req.query.limit)) {
      options.page = req.query.page;
      options.limit = req.query.limit;
    }

    const results = await ItemModel.paginate(
      await createFilterForMongooseQuery(req.query),
      options
    );

    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(`Error: ${e}`);
  }
};

/**
 * Sends an object to the client containing all the results matching the filters in the 'docs' field and the number of docs being returned in the 'totalDocs' field
 *
 * @param {*} req
 * @param {*} res
 * @param {*} ItemModel
 */
export const sendAllResults = async (req, res, ItemModel) => {
  try {
    const results = await ItemModel.find(await createFilterForMongooseQuery(req.query))
      .populate('primarySkillAreas')
      .populate('secondarySkillAreas')
      .populate('institution')
      .populate('program')
      .sort(createSortForMongooseQuery(req.query))
      .exec();

    const resultsWithMetadata = {
      docs: results,
      totalDocs: results.length
    };
    res.status(200).send(resultsWithMetadata);
  } catch (e) {
    res.status(500).send(`Error: ${e}`);
  }
};

/**
 * This is a generic find all, allows us to find all the documents of the specified type.
 *
 * @param {Request} req
 * @param {Response} res
 */
export const find = async (req, res) => {
  const ItemModel = getPdsaItemModel(req.params.type.toLowerCase());

  if (ItemModel !== null) {
    // check if they are trying to get paginated results or not
    if (!undefinedNullOrEmpty(req.query.page) && !undefinedNullOrEmpty(req.query.limit))
      sendPaginatedResults(req, res, ItemModel);
    else sendAllResults(req, res, ItemModel);
  } else {
    res.status(400).send(`Error: Provided paramter :type was incorrect`);
  }
};

export const findById = async (req, res) => {
  const ItemModel = getPdsaItemModel(req.params.type.toLowerCase());

  if (ItemModel !== null) {
    try {
      const results = await ItemModel.findById(req.params.id)
        .populate({
          path: 'secondarySkillArea',
          populate: { path: 'parentPrimarySkillArea', model: 'PrimarySkillArea' }
        })
        .populate('institution')
        .populate('program')
        .exec();
      res.status(200).send(results);
    } catch (e) {
      res.status(500).send(`Error: ${e}`);
    }
  } else {
    res.status(400).send(`Error: Provided paramter :type was incorrect`);
  }
};

/**
 * Update the specified pdsa item (specified by id) with the object sent in the request body
 * @param {Request} req
 * @param {Response} res
 */
export const update = async (req, res) => {
  const ItemModel = getPdsaItemModel(req.params.type.toLowerCase());
  if (ItemModel !== null) {
    try {
      // if they are trying to update the sort keys send an error
      if (req.body.primarySkillAreaSortKey || req.body.secondarySkillAreaSortKey) {
        res
          .status(403)
          .send(
            `Error: You are forbidden from modifying the sort keys for this object. They are automatically updated based on the primary and secondary skill areas of this object.`
          );
      } else {
        // check if they are updating the skill areas and update the sort keys too
        if (req.body.primarySkillAreas && req.body.primarySkillAreas.length > 0)
          req.body.primarySkillAreaSortKey = await getPrimarySortKeyName(
            req.body.primarySkillAreas[0]
          );
        if (req.body.secondarySkillAreas && req.body.secondarySkillAreas.length > 0)
          req.body.secondarySkillAreaSortKey = await getSecondarySortKeyName(
            req.body.secondarySkillAreas[0]
          );

        const results = await ItemModel.updateOne({ _id: req.params.id }, req.body, {
          runValidators: true
        });
        res.status(201).send(results);
      }
    } catch (e) {
      res.status(500).send(`Error: ${e}`);
    }
  } else {
    res.status(400).send(`Error: Provided paramter :type was incorrect`);
  }
};

/**
 * Update the specified pdsa item (specified by id) with the object sent in the request body
 * @param {Request} req
 * @param {Response} res
 */
export const overwrite = async (req, res) => {
  const ItemModel = getPdsaItemModel(req.params.type.toLowerCase());
  if (ItemModel !== null) {
    try {
      // if they are trying to update the sort keys send an error
      if (req.body.primarySkillAreaSortKey || req.body.secondarySkillAreaSortKey) {
        res
          .status(403)
          .send(
            `Error: You are forbidden from modifying the sort keys for this object. They are automatically updated based on the primary and secondary skill areas of this object.`
          );
      } else {
        // check if they are updating the skill areas and update the sort keys too
        if (req.body.primarySkillAreas && req.body.primarySkillAreas.length > 0)
          req.body.primarySkillAreaSortKey = await getPrimarySortKeyName(
            req.body.primarySkillAreas[0]
          );
        if (req.body.secondarySkillAreas && req.body.secondarySkillAreas.length > 0)
          req.body.secondarySkillAreaSortKey = await getSecondarySortKeyName(
            req.body.secondarySkillAreas[0]
          );

        const results = await ItemModel.update({ _id: req.params.id }, req.body, {
          runValidators: true,
          overwrite: true
        });
        res.status(201).send(results);
      }
    } catch (e) {
      res.status(500).send(`Error: ${e}`);
    }
  } else {
    res.status(400).send(`Error: Provided paramter :type was incorrect`);
  }
};

/**
 * Update the PDSA items specified by the type and ids. The list of ids to update is in req.body.ids and the updates to be performed are in req.body.updates
 *
 * @param {Request} req
 * @param {Response} res
 */
export const updateMany = async (req, res) => {
  const ItemModel = getPdsaItemModel(req.params.type.toLowerCase());
  if (ItemModel !== null) {
    try {
      if (req.body.ids && req.body.ids.length > 1) {
        // if they are trying to update the sort keys send an error
        if (
          req.body.updates.primarySkillAreaSortKey ||
          req.body.updates.secondarySkillAreaSortKey
        ) {
          res
            .status(403)
            .send(
              `Error: You are forbidden from modifying the sort keys for this object. They are automatically updated based on the primary and secondary skill areas of this object.`
            );
        } else {
          // check if they are updating the skill areas and update the sort keys too
          if (req.body.updates.primarySkillAreas && req.body.updates.primarySkillAreas.length > 0)
            req.body.updates.primarySkillAreaSortKey = await getPrimarySortKeyName(
              req.body.updates.primarySkillAreas[0]
            );
          if (
            req.body.updates.secondarySkillAreas &&
            req.body.updates.secondarySkillAreas.length > 0
          )
            req.body.updates.secondarySkillAreaSortKey = await getSecondarySortKeyName(
              req.body.updates.secondarySkillAreas[0]
            );

          const results = await ItemModel.updateMany(
            { _id: { $in: req.body.ids } },
            req.body.updates,
            { runValidators: true }
          );
          res.status(201).send(results);
        }
      } else if (req.body.ids && req.body.ids.length === 1) {
        res
          .status(403)
          .send(
            `Error: to update a single resource use PUT or PATCH root/pdsa/:type/:id, where type is the plural form of the resource :type you are trying to update and :id is the id of resource you are trying to update.`
          );
      } else {
        res
          .status(400)
          .send(
            `Error: Array of ids to delete is null or empty. You must provide a list of ids to delete in the body of your request as 'ids'. And the updates in req.body.updates`
          );
      }
    } catch (e) {
      res.status(500).send(`Error: ${e}`);
    }
  } else {
    res.status(400).send(`Error: Provided paramter :type was incorrect`);
  }
};

/**
 * Delete the specified pdsa item (specified by id) with the object sent in the request body
 * @param {Request} req
 * @param {Response} res
 */
export const deleteItem = async (req, res) => {
  const ItemModel = getPdsaItemModel(req.params.type.toLowerCase());
  if (ItemModel !== null) {
    try {
      const delRes = await ItemModel.deleteOne({ _id: req.params.id });
      res.status(200).send(delRes);
    } catch (e) {
      res.status(500).send(`Error: ${e}`);
    }
  } else {
    res.status(400).send(`Error: Provided paramter :type was incorrect`);
  }
};

/**
 * Delete the specified pdsa items, where the ids of objects to delete is stored in the ids array in the body of the request.
 * @param {Request} req
 * @param {Response} res
 */
export const deleteMany = async (req, res) => {
  const ItemModel = getPdsaItemModel(req.params.type.toLowerCase());
  if (ItemModel !== null) {
    try {
      // check if it is a batch delete
      if (req.body.ids && req.body.ids.length > 1) {
        const delRes = await ItemModel.deleteMany({ _id: { $in: req.body.ids } });
        res.status(200).send(delRes);
      } else if (req.body.ids && req.body.ids.length === 1) {
        res
          .status(400)
          .send(
            `Error: to delete a single resource use DELETE root/pdsa/:type/:id, where type is the plural form of the resource :type you are trying to delete and :id is the id of resource you are trying to delete.`
          );
      } else {
        res
          .status(400)
          .send(
            `Error: Array of ids to delete is null or empty. You must provide a list of ids to delete in the body of your request as 'ids'. `
          );
      }
    } catch (e) {
      res.status(500).send(`Error: ${e}`);
    }
  } else {
    res.status(400).send(`Error: Provided paramter :type was incorrect`);
  }
};
