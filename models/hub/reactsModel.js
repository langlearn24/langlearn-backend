import mongoose from "mongoose";
import { commonFields } from "../commonFields.js";
import globalPostUpdateMiddleware from "../globalPostUpdateMiddleware.js";

const reactsSchema = mongoose.Schema({
  ...commonFields,
  type: {
    type: String,
    enum: ["like", "love", "haha", "angry", "care"],
    required: true,
  },
  userID: {        // the user who reacts to the post (not the author)
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  postID: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post'
  },
  commentID: {
    type: mongoose.Schema.ObjectId,
    ref: 'Comment'
  },
  replyID: {
    type: mongoose.Schema.ObjectId,
    ref: 'Reply'
  }
});

reactsSchema.plugin(globalPostUpdateMiddleware)

const React = mongoose.model("React", reactsSchema);
export default React;