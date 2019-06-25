import express from 'express';
import { create, find, findById, update, deleteItem } from '../controllers/pdsaItemCrudController';

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

// testing -> provide search param in query and it can return the objects
router.get('/:type/search', (req, res) => {
  res.send(req.query);
});

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

export default router;
