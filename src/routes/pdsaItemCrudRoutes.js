import express from 'express';
import {
  create,
  find,
  findById,
  update,
  deleteItem,
  deleteMany,
  updateMany
} from '../controllers/pdsaItemCrudController';

const router = express.Router();

// ////// //
// CREATE //
// ////// //
/**
 * The route to create a new PDSA item. Creation handled by controller.
 */
router.post('/:type', create);

// //// //
// READ //
// //// //
/**
 * The route to find the different PDSA items. Logic handled by controller.
 */
router.get('/:type', find);

/**
 * Return the PDSA item specified by type and id
 */
router.get('/:type/:id', findById);

// ////// //
// UPDATE //
// ////// //
/**
 * Update the PDSA item specified by type and id
 */
router.put('/:type/:id', update);
/**
 * Update the PDSA item specified by type and id
 */
router.patch('/:type/:id', update);

// ////// //
// DELETE //
// ////// //
/**
 * Delete the PDSA item specified by type and id
 */
router.delete('/:type/:id', deleteItem);

// //////////////// //
// BATCH OPERATIONS //
// //////////////// //
/**
 * Delete the PDSA items specified by type and ids (in req.body.ids)
 */
router.post('/:type/batch-delete', deleteMany);

/**
 * Update the PDSA items specified by the type and ids. The list of ids to update is in req.body.ids and the updates to be performed are in req.body.updates
 */
router.post('/:type/batch-update', updateMany);

export default router;
