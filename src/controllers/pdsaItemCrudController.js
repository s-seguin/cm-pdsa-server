import PdsaItem from '../database/models/pdsaItem';
import Book from '../database/models/types/book';
import Subscription from '../database/models/types/subscription';
import Certification from '../database/models/types/certification';
import Conference from '../database/models/types/conference';
import CourseSeminar from '../database/models/types/courseSeminar';
import Other from '../database/models/types/other';
import PrimarySkillArea from '../database/models/primarySkillArea';
import SecondarySkillArea from '../database/models/secondarySkillArea';
import Institution from '../database/models/institution';
import Program from '../database/models/program';

/**
 * Return the match PdsaItem Model from the provided itemName, if it doesn't match anything return null
 * @param {*} itemName
 */
const getPdsaItemModel = itemName =>
  ({
    book: Book,
    subscription: Subscription,
    certification: Certification,
    conference: Conference,
    'course-seminar': CourseSeminar,
    other: Other,
    'pdsa-item': PdsaItem,
    'primary-skill': PrimarySkillArea,
    'secondary-skill': SecondarySkillArea,
    institution: Institution,
    program: Program
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
export const create = (req, res) => {
  const ItemModel = getPdsaItemModel(req.params.type.toLowerCase());

  // We are a not allowed to create Generic PdsaItems, use type Other instead.
  if (ItemModel !== null && ItemModel !== PdsaItem) {
    // we need to instantiate a new Object of type determined by the pdsaItemSwitch
    const instantiatedItem = new ItemModel(req.body);

    instantiatedItem.save(err => {
      if (err) {
        console.log(`Error: ${err}`);
        res.send(`Error: ${err}`);
      } else res.sendStatus(200);
    });
  } else {
    res.send(
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
export const find = (req, res) => {
  const ItemModel = getPdsaItemModel(req.params.type.toLowerCase());

  if (ItemModel !== null) {
    ItemModel.find()
      .populate('primarySkillArea')
      .populate('secondarySkillArea')
      .exec((err, items) => {
        if (err) return res.send(`Error: ${err}`);
        return res.send(items);
      });
  } else {
    res.send(`Error: Provided paramter :type was incorrect`);
  }
};
