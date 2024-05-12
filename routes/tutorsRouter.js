import express from 'express';
import { updateTutor } from '../controllers/tutorsController.js';
const router = express.Router();

router.route('/:id').patch(updateTutor)
export default router;