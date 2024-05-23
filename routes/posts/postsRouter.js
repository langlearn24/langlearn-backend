import express from 'express';
import { createPost, deletePost, getPost, getAllPosts, updatePost, getFeedsPosts } from '../../controllers/posts/postsController.js';
const router = express.Router();

router.route('/').get(getAllPosts).post(createPost);
router.route('/:id').get(getPost).patch(updatePost).delete(deletePost);

router.route('/getFeedsPosts/:userID').get(getFeedsPosts);
export default router;