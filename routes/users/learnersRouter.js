import express from 'express';
import { updateLearner } from '../../controllers/users/learnersController.js';
const router = express.Router();

router.route('/:id').patch(updateLearner)
export default router;