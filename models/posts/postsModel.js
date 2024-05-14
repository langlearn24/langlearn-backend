import mongoose from "mongoose";
import { commonFields } from "../commonFields.js";

const postsSchema = new mongoose.Schema({
  ...commonFields,
  content: {
    type: String,
    required: [true, "You can't leave your post empty!"],
  },
  image: String,
  authorID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A post without an author is not allowed!"],
  },
  isEdited: { type: Boolean, default: false },
});
const Post = mongoose.model('Post', postsSchema);
export default Post;
