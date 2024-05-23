import Post from "../../models/posts/postsModel.js";
import User from "../../models/users/usersModel.js";
import AppError from "../../utils/appError.js";
import catchAsyncErr from "../../utils/catchAsyncErr.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../global/globalCRUDHandlers.js";

export const getAllPosts = getAll(Post);
export const getPost = getOne(Post);
export const createPost = createOne(Post);
export const updatePost = updateOne(Post);
export const deletePost = deleteOne(Post);

export const getFeedsPosts = catchAsyncErr(async (req, res, next) => {
  const user = await User.findById(req.params.userID);
  if(!user){
    return next(new AppError('No users found with this ID', 404))
  }
  const userFollowingList = user.following;
  const posts = await Post.find({ authorID: { $in: userFollowingList } }).sort({createdAt: -1});
  if (!posts) {
    res.status(200).json({
      status: "success",
      message: "No posts for you now! Please try again.",
    });
  }

  res.status(200).json({
    status: "success",
    results: posts.length,
    posts,
  });
});
