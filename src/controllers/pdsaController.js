import PdsaItem from '../database/models/pdsaItem';
import PdsaType from '../database/models/pdsaType';

export const newItem = (req, res) => {
  const item = new PdsaItem(req.body);
  item.save(err => {
    if (err) {
      console.log(`Error: ${err}`);
      res.send(err);
    } else res.sendStatus(200);
  });
};

export const newType = (req, res) => {
  const item = new PdsaType(req.body);
  item.save(err => {
    if (err) {
      console.log(`Error: ${err}`);
      res.send(err);
    } else res.sendStatus(200);
  });
};

export const findAllType = (req, res) => {
  PdsaType.find((err, items) => {
    if (err) return console.error(err);
    return res.send(items);
  });
};

export const findAll = (req, res) => {
  PdsaItem.find()
    .populate('pdsaType')
    .exec((err, items) => {
      if (err) return console.error(err);
      return res.send(items);
    });
};
