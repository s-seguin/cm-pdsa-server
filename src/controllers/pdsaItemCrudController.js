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
const getPdsaItem = itemName =>
  ({
    book: Book,
    subscription: Subscription,
    certification: Certification,
    conference: Conference,
    'course-seminar': CourseSeminar,
    other: Other,
    '*': PdsaItem
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
  let item = getPdsaItem(req.params.type.toLowerCase());

  // We are a not allowed to create Generic PdsaItems, use type Other instead.
  if (item !== null && item !== PdsaItem) {
    // we need to instantiate a new Object of type determined by the pdsaItemSwitch
    // eslint-disable-next-line new-cap
    item = new item(req.body);

    item.save(err => {
      if (err) {
        console.log(`Error: ${err}`);
        res.send(`Error: ${err}`);
      } else res.sendStatus(200);
    });
  } else {
    res.send(
      item !== PdsaItem
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
  const item = getPdsaItem(req.params.type.toLowerCase());

  if (item !== null) {
    item
      .find()
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
