import express from 'express';
import { createComment, deleteComment, getComment, getAllComments, updateComment, getCommentReacts, getCommentReplies } from '../../controllers/hub/commentsController.js';
const router = express.Router();

router.route('/').get(getAllComments).post(createComment);
router.route('/:id').get(getComment).patch(updateComment).delete(deleteComment);

router.route('/:id/reacts').get(getCommentReacts);
router.route("/:id/replies").get(getCommentReplies);


export default router;