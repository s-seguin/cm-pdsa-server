import PdsaItem from '../database/models/pdsaItem';

/**
 * Creates a new PdsaItem to store in the DB from the JSON data passed in the req.body.
 *
 * TODO: Add validation that the data being received is correct.
 * @param {*} req the request object
 * @param {*} res the response object
 */
export const newItem = (req, res) => {
  const item = new PdsaItem(req.body);
  item.save(err => {
    if (err) {
      console.log(`Error: ${err}`);
      res.send(err);
    } else res.sendStatus(200);
  });
};

/**
 * Get all of the PDSA types in the database.
 *
 * @param {*} req
 * @param {*} res
 */
export const findAllItems = (req, res) => {
  PdsaItem.find()
    .populate('pdsaType')
    .populate('primarySkillArea')
    .populate('secondarySkillArea')
    .exec((err, items) => {
      if (err) return console.error(err);
      return res.send(items);
    });
};
