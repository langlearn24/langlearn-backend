import mongoose from "mongoose";
import { commonFields } from "../commonFields.js";
import catchAsyncErr from "../../utils/catchAsyncErr.js";
import globalPostUpdateMiddleware from "../globalPostUpdateMiddleware.js";

const postsSchema = new mongoose.Schema({
  ...commonFields,
  content: {
    type: String,
    required: [true, "You can't leave your post empty!"],
  },
  images: [String],
  authorID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A post without an author is not allowed!"],
  },
  isEdited: { type: Boolean, default: false },
});

postsSchema.plugin(globalPostUpdateMiddleware, {modelName: 'Post'})
const Post = mongoose.model("Post", postsSchema);
export default Post;
