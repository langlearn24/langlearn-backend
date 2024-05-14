import express from 'express';
import { createPostReact, deletePostReact, getPostReact, updatePostReact } from '../../controllers/posts/postReactsController.js';
const router = express.Router();

router.route('/').post(createPostReact);
router.route('/:id').get(getPostReact).patch(updatePostReact).delete(deletePostReact);
export default router;