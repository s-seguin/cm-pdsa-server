import PrimarySkillArea from '../database/models/primarySkillArea';
import SecondarySkillArea from '../database/models/secondarySkillArea';

/**
 * Creates a new PrimarySkillArea to store in the DB from the JSON data passed in the req.body.
 *
 * TODO: Add validation that the data being received is correct.
 *
 * @param {*} req the request object
 * @param {*} res the response object
 */
export const newPrimarySkill = (req, res) => {
  const item = new PrimarySkillArea(req.body);
  item.save(err => {
    if (err) {
      console.log(`Error: ${err}`);
      res.send(err);
    } else res.sendStatus(200);
  });
};

/**
 * Creates a new SecondarySkillArea to store in the DB from the JSON data passed in the req.body.
 *
 * TODO: Add validation that the data being received is correct.
 *
 * @param {*} req the request object
 * @param {*} res the response object
 */
export const newSecondarySkill = (req, res) => {
  const item = new SecondarySkillArea(req.body);
  item.save(err => {
    if (err) {
      console.log(`Error: ${err}`);
      res.send(err);
    } else res.sendStatus(200);
  });
};

/**
 * Get all of the PrimarySkillAreas in the database.
 *
 * @param {*} req
 * @param {*} res
 */
export const findAllPrimarySkills = (req, res) => {
  PrimarySkillArea.find((err, items) => {
    if (err) return console.error(err);
    return res.send(items);
  });
};

/**
 * Get all of the SecondarySkillAreas in the database.
 *
 * @param {*} req
 * @param {*} res
 */
export const findAllSecondarySkills = (req, res) => {
  SecondarySkillArea.find((err, items) => {
    if (err) return console.error(err);
    return res.send(items);
  });
};
