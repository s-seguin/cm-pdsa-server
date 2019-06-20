import express from 'express';
import {
  createMetadata,
  findMetadata,
  unsafeDeleteMetadataById,
  unsafeDeleteMetadataByName
} from '../controllers/metadataCrudController';

const router = express.Router();

/**
 * The route to create a new PDSA item. Creation handled by controller.
 */
router.post('/create/:type', createMetadata);

router.delete('/delete/:type/id/:id', unsafeDeleteMetadataById);

router.delete('/delete/:type/name/:name', unsafeDeleteMetadataByName);

/**
 * The route to find the different PDSA items. Logic handled by controller.
 */
router.get('/find/all/:type', findMetadata);

// router.get('/find/children/:id', findAllSecondarySkills);

// router.get('/find/unique/:type/:id');

// router.get('/find/matching/:type/:name')

export default router;
