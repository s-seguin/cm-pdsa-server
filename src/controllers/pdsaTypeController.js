import PdsaType from '../database/models/pdsaType';

/**
 * Creates a new PdsaType to store in the DB from the JSON data passed in the req.body.
 *
 * TODO: Add validation that the data being received is correct.
 * @param {*} req the request object
 * @param {*} res the response object
 */
export const newType = (req, res) => {
  const item = new PdsaType(req.body);
  item.save(err => {
    if (err) {
      console.log(`Error: ${err}`);
      res.send(err);
    } else res.sendStatus(200);
  });
};

export const findAllTypes = (req, res) => {
  PdsaType.find((err, items) => {
    if (err) return console.error(err);
    return res.send(items);
  });
};
