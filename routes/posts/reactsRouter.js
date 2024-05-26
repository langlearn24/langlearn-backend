import express from 'express';
import { createReact, deleteReact, getAllReacts, getReact, updateReact } from '../../controllers/posts/reactsController.js';
const router = express.Router();

router.route('/').get(getAllReacts).post(createReact);
router.route('/:id').get(getReact).patch(updateReact).delete(deleteReact);
export default router;