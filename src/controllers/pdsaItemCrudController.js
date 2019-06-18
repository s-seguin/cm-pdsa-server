import PdsaItem from '../database/models/pdsaItem';
import Book from '../database/models/types/book';
import Subscription from '../database/models/types/subscription';
import Certification from '../database/models/types/certification';
import Conference from '../database/models/types/conference';
import CourseSeminar from '../database/models/types/courseSeminar';
import Other from '../database/models/types/other';

/**
 * Creates a new PdsaItem to store in the DB from the JSON data passed in the req.body.
 *
 * TODO: Add validation that the data being received is correct.
 * @param {*} req the request object
 * @param {*} res the response object
 */
export const create = (req, res) => {
  let item = null;

  switch (req.params.type) {
    case 'book':
      item = new Book(req.body);
      break;
    case 'subscription':
      item = new Subscription(req.body);
      break;
    case 'certification':
      item = new Certification(req.body);
      break;
    case 'conference':
      item = new Conference(req.body);
      break;
    case 'course-seminar':
      item = new CourseSeminar(req.body);
      break;
    case 'other':
      item = new Other(req.body);
      break;
    default:
      item = null;
      break;
  }
  if (item !== null) {
    item.save(err => {
      if (err) {
        console.log(`Error: ${err}`);
        res.send(`Error: ${err}`);
      } else res.sendStatus(200);
    });
  } else {
    res.send(`Error: Provided paramter :type was incorrect`);
  }
};

/**
 * Get all of the PDSA types in the database.
 *
 * @param {*} req
 * @param {*} res
 */
export const find = (req, res) => {
  let item = null;

  switch (req.params.type) {
    case 'book':
      item = Book;
      break;
    case 'subscription':
      item = Subscription;
      break;
    case 'certification':
      item = Certification;
      break;
    case 'conference':
      item = Conference;
      break;
    case 'course-seminar':
      item = CourseSeminar;
      break;
    case 'other':
      item = Other;
      break;
    case 'all':
      item = PdsaItem;
      break;
    default:
      item = null;
      break;
  }
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
