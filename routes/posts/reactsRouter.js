import express from 'express';
import { createReact, deleteReact, getReact, updateReact } from '../../controllers/posts/reactsController.js';
const router = express.Router();

router.route('/').post(createReact);
router.route('/:id').get(getReact).patch(updateReact).delete(deleteReact);
export default router;