import PrimarySkillArea from '../database/models/primarySkillArea';
import SecondarySkillArea from '../database/models/secondarySkillArea';

export const newPrimarySkill = (req, res) => {
  const item = new PrimarySkillArea(req.body);
  item.save(err => {
    if (err) {
      console.log(`Error: ${err}`);
      res.send(err);
    } else res.sendStatus(200);
  });
};

export const newSecondarySkill = (req, res) => {
  const item = new SecondarySkillArea(req.body);
  item.save(err => {
    if (err) {
      console.log(`Error: ${err}`);
      res.send(err);
    } else res.sendStatus(200);
  });
};

export const findAllPrimarySkills = (req, res) => {
  PrimarySkillArea.find((err, items) => {
    if (err) return console.error(err);
    return res.send(items);
  });
};

export const findAllSecondarySkills = (req, res) => {
  SecondarySkillArea.find((err, items) => {
    if (err) return console.error(err);
    return res.send(items);
  });
};
