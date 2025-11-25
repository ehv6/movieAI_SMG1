import { Router } from 'express';
import * as MoviesController from '../controllers/MoviesController.js';
import { getRecommendations, getAiRecommendations } from '../controllers/RecommendationController.js';

const router = Router();

router.get('/featured', MoviesController.getFeatured);
router.get('/new-releases', MoviesController.getNewReleases);
router.get('/action', MoviesController.getAction);
router.get('/scifi', MoviesController.getSciFi);
router.get('/comedy', MoviesController.getComedy);
router.get('/thriller', MoviesController.getThriller);
router.get('/horror', MoviesController.getHorror);
router.get('/suspense', MoviesController.getSuspense);
router.get('/drama', MoviesController.getDrama);
router.get('/recommendations', getRecommendations);
router.get('/ai-recommendations', getAiRecommendations);
router.get('/details/:id', MoviesController.getMovieDetails);
router.get('/:id/providers', MoviesController.getWatchProviders);

export default router;