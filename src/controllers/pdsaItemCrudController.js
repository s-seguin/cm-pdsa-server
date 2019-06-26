import PdsaItem from '../database/models/pdsaItem';
import Book from '../database/models/types/book';
import Subscription from '../database/models/types/subscription';
import Certification from '../database/models/types/certification';
import Conference from '../database/models/types/conference';
import CourseSeminar from '../database/models/types/courseSeminar';
import Other from '../database/models/types/other';

/**
 * Return the match PdsaItem Model from the provided itemName, if it doesn't match anything return null
 * @param {*} itemName
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
    res.send(
      400,
      ItemModel !== PdsaItem
        ? `Error: Provided paramter :type was incorrect`
        : `Error: Provided paramter :type was incorrect. Do not try and create generic PdsaItems, use type Other instead.`
    );
  }
};

/**
 * This is a generic find all, allows us to find all the documents of the specified type.
 *
 * @param {*} req
 * @param {*} res
 */
export const find = async (req, res) => {
  const ItemModel = getPdsaItemModel(req.params.type.toLowerCase());

  if (ItemModel !== null) {
    try {
      const results = await ItemModel.find()
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
      const results = await ItemModel.update({ _id: req.params.id }, req.body);
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
