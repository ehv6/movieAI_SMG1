import { Router } from 'express';
import * as SearchController from '../controllers/SearchController.js';
import { aiSearch } from '../controllers/AiSearchController.js';

const router = Router();

router.get('/search', SearchController.search);
router.get('/ai-search', aiSearch);

export default router;
