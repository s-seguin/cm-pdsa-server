import express from 'express';
import {
  createMetadata,
  findMetadata,
  deleteMetadataById,
  findMetadataById,
  updateMetadataById,
  findMetadataByName,
  findMetadataByParentId
} from '../controllers/metadataCrudController';
import locationController from '../controllers/locationController';

const router = express.Router();

// ///////// //
// LOCATIONS //
// ///////// //

// This needs to go before the generic routes so that we don't drop into CRUD routes for metadata with invalid :type
/**
 * This route provides an array of all the location strings in the database
 */
router.get('/locations', async (req, res) => {

  const results = (await PdsaItem.find().select('location')).map(x => x.location);
  res.send(results);
);

// ////// //
// CREATE //
// ////// //
/**
 * The route to create a new PDSA item. Creation handled by controller.
 */
router.post('/:type', createMetadata);

// //// //
// READ //
// //// //
/**
 * The route to find the different PDSA items. Logic handled by controller.
 */
router.get('/:type', findMetadata);

/**
 * Return a singular metadata object of type 'type' specified by id
 */
router.get('/:type/:id', findMetadataById);

/**
 * Return all metadata objects of type 'type' that match the specified name
 *
 * Should return singular objects due to unique nature of schemas
 */
router.get('/:type/name/:name', findMetadataByName);

/**
 * Return all metadata objects of type 'type' that belong to parent with parent id = 'parentId'
 */
router.get('/:type/parent-id/:parentId', findMetadataByParentId);

// ////// //
// UPDATE //
// ////// //
/**
 * Update metadata object with specified type and id, updated object provided in body
 */
router.patch('/:type/:id', updateMetadataById);
router.put('/:type/:id', updateMetadataById);

// ////// //
// DELETE //
// ////// //
/**
 * Delete the metadata object with the specified type and id
 */
router.delete('/:type/:id', deleteMetadataById);

export default router;
