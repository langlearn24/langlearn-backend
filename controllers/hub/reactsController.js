import { ObjectId } from "mongodb";
import Post from "../../models/hub/postsModel.js";
import react from "../../models/hub/reactsModel.js";
import AppError from "../../utils/appError.js";
import catchAsyncErr from "../../utils/catchAsyncErr.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../global/globalCRUDHandlers.js";
import mongoose from "mongoose";
import React from "../../models/hub/reactsModel.js";

export const updateReact = updateOne(react);
export const deleteReact = deleteOne(react);
export const getReact = getOne(react);
export const getAllReacts = getAll(react);

export const createReact = catchAsyncErr(async (req, res, next) => {
  let field;
  let statusCode;
  let messageOperation;
  let outputReact;

  if (req.body.reactTo === "post") field = "postID";
  else if (req.body.reactTo === "comment") field = "commentID";
  else if (req.body.reactTo === "reply") field = "replyID";
  const query = {
    userID: req.body.userID,
  };
  query[field] = req.body.itemID;
  const existingReact = await React.findOne(query);
  if (existingReact) {
    existingReact.type = req.body.type;
    await existingReact.save({ validateBeforeSave: true });
    statusCode = 200;
    messageOperation = "updated";
    outputReact = existingReact;
  } else {
    query["type"] = req.body.type;
    outputReact = await React.create(query);
    statusCode = 201;
    messageOperation = "created";
  }
  res.status(statusCode).json({
    status: "success",
    message: `React ${messageOperation} successfully`,
    react: outputReact,
  });
});
