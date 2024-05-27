import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getAllPosts,
  updatePost,
  getFeedsPosts,
  getPostReacts,
  getPostComments,
} from "../../controllers/hub/postsController.js";
const router = express.Router();

router.route("/").get(getAllPosts).post(createPost);
router.route("/:id").get(getPost).patch(updatePost).delete(deletePost);

router.route("/:id/reacts").get(getPostReacts);
router.route("/:id/comments").get(getPostComments);

router.route("/getFeedsPosts/:userID").get(getFeedsPosts);
export default router;
