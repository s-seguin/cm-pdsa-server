import PdsaType from '../database/models/pdsaType';

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
