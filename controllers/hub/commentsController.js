import mongoose, { ObjectId } from "mongodb";
import Comment from "../../models/hub/commentsModel.js";
import React from "../../models/hub/reactsModel.js";
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
import Reply from "../../models/hub/repliesModel.js";

export const getComment = getOne(Comment);
export const createComment = createOne(Comment);
export const deleteComment = deleteOne(Comment);

export const updateComment = catchAsyncErr(async (req, res, next) => {
  // Check if the new values of the document are the same as its original
  // values (meaning no changes), and return an error if so, and update the 
  // document otherwise
  const originalComment = await Comment.findById(req.params.id);
  if (
    originalComment.content === req.body?.content ||
    originalComment.images === req.body?.images
  ) {
    return next(
      new AppError("No changes detected! Write something to update", 400)
    );
  }
  const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedComment) {
    return next(
      new AppError("This comment was deleted", 404)
    );
  }

  res.status(200).json({
    status: "success",
    message: "Comment updated successfully",
    comment: updatedComment,
  });
});


export const getCommentReacts = catchAsyncErr(async (req, res, next) => {
    /**  Fetching all reacts of the given comment, grouping them by type, and adding the count
     *   of the reacts of each type as well as the users who reacted to the comment with 
     *   each react type
    */
  const commentObjId = new ObjectId(req.params.id);
  const reacts = await React.aggregate([
    [
      { $match: { commentID: commentObjId } },
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
    status: "success",
  };
  if (reacts.length === 0) {
    resObj["message"] = "No reacts for this comment at the moment";
  } else {
    resObj["reacts"] = reacts;
  }

  res.status(200).json(resObj);
});

export const getCommentReplies = catchAsyncErr(async(req, res, next) => {
    const commentObjId = new ObjectId(req.params.id); 
    const replies = await Reply.find({commentID: commentObjId});
  
    let resObj = {
      status: 'success'
    }
    if(replies.length === 0){
      resObj['message'] = 'This comment has no replies at the moment';
    }else{
      resObj['count'] = replies.length
      resObj['replies'] = replies;
    }
    
    res.status(200).json(resObj) 
  })
