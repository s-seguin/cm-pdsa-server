import PrimarySkillArea from '../database/models/metadata/primarySkillArea';
import SecondarySkillArea from '../database/models/metadata/secondarySkillArea';
import Institution from '../database/models/metadata/institution';
import Program from '../database/models/metadata/program';
import PdsaItem from '../database/models/pdsaItem';

/**
 * Return the matching Model from the provided itemName, if it doesn't match anything return null
 * @param {String} itemName
 */
const getMetadataModel = itemName =>
  ({
    'primary-skills': PrimarySkillArea,
    'secondary-skills': SecondarySkillArea,
    institutions: Institution,
    programs: Program
  }[itemName] || null);

/**
 * Creates a new MetadataItem to store in the DB from the JSON data passed in the req.body.
 *
 * This is a generic controller that looks at the PDSA type being requested through the url parameters
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
export const createMetadata = async (req, res) => {
  const MetadataModel = getMetadataModel(req.params.type.toLowerCase());

  if (MetadataModel !== null) {
    // we need to instantiate a new Object of type determined by getMetadataModel
    const instantiatedItem = new MetadataModel(req.body);

    try {
      const result = await instantiatedItem.save();
      res.status(201).send(result);
    } catch (e) {
      res.status(500).send(`Error: ${e}`);
    }
  } else {
    res.status(400).send(`Error: Provided paramter :type was incorrect`);
  }
};

/**
 * This is a generic find all, allows us to find all the documents of the specified type.
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
export const findMetadata = async (req, res) => {
  const MetadataModel = getMetadataModel(req.params.type.toLowerCase());
  if (MetadataModel !== null) {
    try {
      const results = await MetadataModel.find()
        .populate('parentPrimarySkillArea')
        .populate({
          path: 'secondarySkillArea',
          populate: { path: 'parentPrimarySkillArea', model: 'PrimarySkillArea' }
        })
        .populate('institution')
        .populate('program')
        .exec();

      res.status(200).send(results);
    } catch (e) {
      res.status(500).send(`Error: ${e}`);
    }
  } else {
    res.status(400).send(`Error: Provided paramter :type was incorrect`);
  }
};

/**
 * This is a generic find returns a singular item that matches the type and id provided.
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
export const findMetadataById = async (req, res) => {
  const MetadataModel = getMetadataModel(req.params.type.toLowerCase());

  if (MetadataModel !== null) {
    try {
      const results = await MetadataModel.findById(req.params.id)
        .populate('parentPrimarySkillArea')
        .populate({
          path: 'secondarySkillArea',
          populate: { path: 'parentPrimarySkillArea', model: 'PrimarySkillArea' }
        })
        .populate('institution')
        .populate('program')
        .exec();

      res.status(200).send(results);
    } catch (e) {
      res.status(500).send(`Error: ${e}`);
    }
  } else {
    res.status(400).send(`Error: Provided paramter :type was incorrect`);
  }
};

/**
 * This is a generic find returns items that match the type and name.
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
export const findMetadataByName = async (req, res) => {
  const MetadataModel = getMetadataModel(req.params.type.toLowerCase());

  if (MetadataModel !== null) {
    try {
      const results = await MetadataModel.find({ name: req.params.name })
        .populate('parentPrimarySkillArea')
        .populate({
          path: 'secondarySkillArea',
          populate: { path: 'parentPrimarySkillArea', model: 'PrimarySkillArea' }
        })
        .populate('institution')
        .populate('program')
        .exec();

      res.status(200).send(results);
    } catch (e) {
      res.status(500).send(`Error: ${e}`);
    }
  } else {
    res.status(400).send(`Error: Provided paramter :type was incorrect`);
  }
};

/**
 * This method returns all metadata objects of the specified type that are children of the specified parent-id
 *
 * @param {Request} req
 * @param {Response} res
 */
export const findMetadataByParentId = async (req, res) => {
  const MetadataModel = getMetadataModel(req.params.type.toLowerCase());

  if (
    MetadataModel !== null &&
    (MetadataModel === Program || MetadataModel === SecondarySkillArea)
  ) {
    try {
      const searchParam =
        MetadataModel === Program
          ? { institution: req.params.parentId }
          : { parentPrimarySkillArea: req.params.parentId };

      const results = await MetadataModel.find(searchParam)
        .populate('parentPrimarySkillArea')
        .populate({
          path: 'secondarySkillArea',
          populate: { path: 'parentPrimarySkillArea', model: 'PrimarySkillArea' }
        })
        .populate('institution')
        .populate('program')
        .exec();

      res.status(200).send(results);
    } catch (e) {
      res.status(500).send(`Error: ${e}`);
    }
  } else {
    res.status(400).send(`Error: Provided paramter :type was incorrect`);
  }
};

/**
 * Delete the Metadata Item specified in req.params.type with id = req.params.id
 *
 * If the Model we are deleting has a pre 'remove' hook, it will check if specified model has any children that also need to be removed.
 *
 * Returns the item we deleted. Does not return information about any children items we have deleted.
 *
 * @param {Request} req the req object, req.params.id is the id of the object we want to delete
 * @param {Response} res the result object that we return to the client
 */
export const deleteMetadataById = async (req, res) => {
  const MetadataModel = getMetadataModel(req.params.type.toLowerCase());
  if (MetadataModel !== null) {
    // Find the item we want to delete
    try {
      const itemToDelete = await MetadataModel.findById(req.params.id);
      const delResults = await itemToDelete.remove();

      res.status(200).send(delResults);
    } catch (e) {
      res.status(500).send(`Error: ${e}`);
    }
  } else {
    res.status(400).send(`Error: Provided paramter :type was incorrect`);
  }
};

/**
 * Update the specified metadata item (specified by id) with the object sent in the request body
 * @param {Request} req
 * @param {Response} res
 */
export const updateMetadataById = async (req, res) => {
  const MetadataModel = getMetadataModel(req.params.type.toLowerCase());
  if (MetadataModel !== null) {
    try {
      // if the metadata is a skill area, grab its old name
      let oldName = '';
      if (MetadataModel === PrimarySkillArea || MetadataModel === SecondarySkillArea)
        oldName = (await MetadataModel.findById(req.params.id).exec()).name;

      // update the metadata
      const updateRes = await MetadataModel.update({ _id: req.params.id }, req.body, {
        runValidators: true
      });

      if (updateRes.nModified > 0) {
        // we successfully updated the name of this piece of metadata if its a skill area, update the sort key
        // keep track of how many keys we are updating to pass to the client
        let updatedKeyCount = 0;
        if (oldName && PrimarySkillArea) {
          updatedKeyCount = (await PdsaItem.update(
            { primarySkillAreaSortKey: oldName },
            { primarySkillAreaSortKey: req.body.name }
          )).nModified;
        } else if (oldName && SecondarySkillArea) {
          updatedKeyCount = (await PdsaItem.update(
            { secondarySkillAreaSortKey: oldName },
            { secondarySkillAreaSortKey: req.body.name }
          )).nModified;
        }

        updateRes.nSortKeysUpdated = updatedKeyCount;
        res.status(201).send(updateRes);
      } else {
        res.status(200).send(updateRes);
      }
    } catch (e) {
      res.status(500).send(`Error: ${e}`);
    }
  } else {
    res.status(400).send(`Error: Provided paramter :type was incorrect`);
  }
};
