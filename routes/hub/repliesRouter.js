import express from 'express';
import { createReply, deleteReply, getReply, getAllReplies, updateReply, getReplyReacts } from '../../controllers/hub/repliesController.js';
const router = express.Router();

router.route('/').get(getAllReplies).post(createReply);
router.route('/:id').get(getReply).patch(updateReply).delete(deleteReply);

router.route('/:id/reacts').get(getReplyReacts);

export default router;