import Other from '../../database/models/types/other';

/**
 * Creates a new Other PDSA items to store in the DB from the JSON data passed in the req.body.
 *
 * TODO: Add validation that the data being received is correct.
 * @param {*} req the request object
 * @param {*} res the response object
 */
export const newOtherItem = (req, res) => {
  const item = new Other(req.body);
  item.save(err => {
    if (err) {
      console.log(`Error: ${err}`);
      res.send(`Error: ${err}`);
    } else res.sendStatus(200);
  });
};

/**
 * Get all of the Other PDSA items in the database.
 *
 * @param {*} req
 * @param {*} res
 */
export const findAllOtherItems = (req, res) => {
  Other.find()
    .populate('primarySkillArea')
    .populate('secondarySkillArea')
    .exec((err, items) => {
      if (err) return res.send(`Error: ${err}`);
      return res.send(items);
    });
};
