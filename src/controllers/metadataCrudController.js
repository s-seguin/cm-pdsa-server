import PdsaItem from '../database/models/pdsaItem';
import PrimarySkillArea from '../database/models/metadata/primarySkillArea';
import SecondarySkillArea from '../database/models/metadata/secondarySkillArea';
import Institution from '../database/models/metadata/institution';
import Program from '../database/models/metadata/program';

/**
 * Return the match PdsaItem Model from the provided itemName, if it doesn't match anything return null
 * @param {*} itemName
 */
const getMetadataModel = itemName =>
  ({
    'primary-skill': PrimarySkillArea,
    'secondary-skill': SecondarySkillArea,
    institution: Institution,
    program: Program
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
export const createMetadata = (req, res) => {
  const ItemModel = getMetadataModel(req.params.type.toLowerCase());

  // We are a not allowed to create Generic PdsaItems, use type Other instead.
  if (ItemModel !== null && ItemModel !== PdsaItem) {
    // we need to instantiate a new Object of type determined by the pdsaItemSwitch
    const instantiatedItem = new ItemModel(req.body);

    instantiatedItem.save(err => {
      if (err) {
        console.log(`Error: ${err}`);
        res.send(`Error: ${err}`);
      } else res.sendStatus(200);
    });
  } else {
    res.send(
      ItemModel !== PdsaItem
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
export const findMetadata = (req, res) => {
  const ItemModel = getMetadataModel(req.params.type.toLowerCase());

  if (ItemModel !== null) {
    ItemModel.find()
      // .populate('primarySkillArea')
      .populate({
        path: 'secondarySkillArea',
        populate: { path: 'parentPrimarySkillArea', model: 'PrimarySkillArea' }
      })
      .populate('institution')
      .populate('program')
      .exec((err, items) => {
        if (err) return res.send(`Error: ${err}`);
        return res.send(items);
      });
  } else {
    res.send(`Error: Provided paramter :type was incorrect`);
  }
};

/**
 * Delete the Metadata Item specified in req.params.type with id = req.params.id
 *
 * Does not check if anything uses this Metadata item before deleting.
 *
 * @param {*} req
 * @param {*} res
 */
export const unsafeDeleteMetadataById = (req, res) => {
  const ItemModel = getMetadataModel(req.params.type.toLowerCase());
  if (ItemModel !== null) {
    ItemModel.deleteOne({ _id: req.params.id }, (err, items) => {
      if (err) return res.send(`Error: ${err}`);
      return res.send(items);
    });
  } else {
    res.send(`Error: Provided paramter :type was incorrect`);
  }
};

/**
 * Delete the Metadata Item specified in req.params.type with id = req.params.id
 *
 * Does not check if anything uses this Metadata item before deleting.
 *
 * @param {*} req
 * @param {*} res
 */
export const unsafeDeleteMetadataByName = (req, res) => {
  const ItemModel = getMetadataModel(req.params.type.toLowerCase());
  if (ItemModel !== null) {
    ItemModel.deleteOne({ name: req.params.name }, (err, items) => {
      if (err) return res.send(`Error: ${err}`);
      return res.send(items);
    });
  } else {
    res.send(`Error: Provided paramter :type was incorrect`);
  }
};
