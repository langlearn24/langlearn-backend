import express from 'express';
import { updateLearner } from '../controllers/learnersController.js';
const router = express.Router();

router.route('/:id').patch(updateLearner)
export default router;