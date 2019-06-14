import PdsaItem from '../database/models/pdsaItem';

export const newItem = (req, res) => {
  const item = new PdsaItem(req.body);
  item.save(err => {
    if (err) {
      console.log(`Error: ${err}`);
      res.send(err);
    } else res.sendStatus(200);
  });
};

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
