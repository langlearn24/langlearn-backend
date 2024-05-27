import mongoose, { ObjectId } from "mongodb";
import Reply from "../../models/hub/repliesModel.js";
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

export const getAllReplies = getAll(Reply);
export const getReply = getOne(Reply);
export const createReply = createOne(Reply);
export const deleteReply = deleteOne(Reply);

export const updateReply = catchAsyncErr(async (req, res, next) => {
  // Check if the new values of the document are the same as its original
  // values (meaning no changes), and return an error if so, and update the 
  // document otherwise
  const originalReply = await Reply.findById(req.params.id);
  if (
    originalReply.content === req.body?.content ||
    originalReply.images === req.body?.images
  ) {
    return next(
      new AppError("No changes detected! Write something to update", 400)
    );
  }
  const updatedReply = await Reply.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedReply) {
    return next(
      new AppError("This reply was deleted", 404)
    );
  }

  res.status(200).json({
    status: "success",
    message: "Reply updated successfully",
    reply: updatedReply,
  });
});


export const getReplyReacts = catchAsyncErr(async (req, res, next) => {
    /**  Fetching all reacts of the given reply, grouping them by type, and adding the count
     *   of the reacts of each type as well as the users who reacted to the reply with 
     *   each react type
    */
  const replyObjId = new ObjectId(req.params.id);
  const reacts = await React.aggregate([
    [
      { $match: { replyID: replyObjId } },
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
    resObj["message"] = "No reacts for this reply at the moment";
  } else {
    resObj["reacts"] = reacts;
  }

  res.status(200).json(resObj);
});
