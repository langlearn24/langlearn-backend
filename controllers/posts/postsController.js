import mongoose, { ObjectId } from "mongodb";
import Post from "../../models/posts/postsModel.js";
import React from "../../models/posts/reactsModel.js";
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
  if (!user) {
    return next(new AppError("No users found with this ID", 404));
  }
  const userFollowingList = user.following;
  const posts = await Post.find({ authorID: { $in: userFollowingList } }).sort({
    createdAt: -1,
  });
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

export const getPostReacts = catchAsyncErr(async (req, res, next) => {
  const postObjId = new ObjectId(req.params.id);
  /**  Fetching all reacts of the given post, grouping them by type, and adding the count
   * of the reacts of each type as well as the users who reacted to the post with each react type
   */
  const reacts = await React.aggregate([
    [
      { $match: { postID: postObjId } },
      {
        $group: {
          _id: "$type",
          count: {
            $sum: 1,
          },
          users: { $push: "$userID" },
        },
      },
      {
        $project: {
          _id: 0,
          type: "$_id",
          count: 1,
          users: 1,
        },
      },
    ],
  ]);

  const resObj = {
    status: 'success',
  }
  if(reacts.length === 0){ resObj['message'] = 'No reacts for this post at the moment'}
  else{resObj['reacts'] = reacts}

  res.status(200).json(resObj);
});