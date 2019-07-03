import PdsaItem from '../database/models/pdsaItem';
import Book from '../database/models/types/book';
import Subscription from '../database/models/types/subscription';
import Certification from '../database/models/types/certification';
import Conference from '../database/models/types/conference';
import CourseSeminar from '../database/models/types/courseSeminar';
import Other from '../database/models/types/other';
import { undefinedNullOrEmpty, mongooseQueryBuilderForFilter } from './helpers/queryHelper';

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
 * Creates a new PdsaItem to store in the DB from the JSON data passed in the req.body.
 *
 * This is a generic controller that looks at the PDSA type being requested through the url parameters
 *
 * TODO: Add validation that the data being received is correct. Will be done in models.
 * @param {*} req the request object
 * @param {*} res the response object
 */
export const create = async (req, res) => {
  const ItemModel = getPdsaItemModel(req.params.type.toLowerCase());

  // We are a not allowed to create Generic PdsaItems, use type Other instead.
  if (ItemModel !== null && ItemModel !== PdsaItem) {
    // we need to instantiate a new Object of type determined by the pdsaItemSwitch
    const instantiatedItem = new ItemModel(req.body);

    try {
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
      populate: ['primarySkillAreas', 'secondarySkillAreas', 'program', 'institution']
    };
    if (!undefinedNullOrEmpty(req.query.page) && !undefinedNullOrEmpty(req.query.limit)) {
      options.page = req.query.page;
      options.limit = req.query.limit;
    }

    const results = await ItemModel.paginate(mongooseQueryBuilderForFilter(req.query), options);

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
    const results = await ItemModel.find(mongooseQueryBuilderForFilter(req.query))
      .populate('primarySkillAreas')
      .populate('secondarySkillAreas')
      .populate('institution')
      .populate('program')
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
      const results = await ItemModel.updateOne({ _id: req.params.id }, req.body);
      res.status(201).send(results);
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
 * Update the specified pdsa item (specified by id) with the object sent in the request body
 * @param {Request} req
 * @param {Response} res
 */
export const deleteMany = async (req, res) => {
  const ItemModel = getPdsaItemModel(req.params.type.toLowerCase());
  if (ItemModel !== null) {
    try {
      let delRes = null;
      if (req.query.ids === undefined) delRes = await ItemModel.deleteMany();
      else {
        const ids = req.query.ids.split(',');
        delRes = await ItemModel.deleteMany({ _id: { $in: ids } });
      }
      res.status(200).send(delRes);
    } catch (e) {
      res.status(500).send(`Error: ${e}`);
    }
  } else {
    res.status(400).send(`Error: Provided paramter :type was incorrect`);
  }
};
