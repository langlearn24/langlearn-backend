import mongoose from "mongoose";
import { commonFields } from "../commonFields.js";
import globalPostUpdateMiddleware from "../globalPostUpdateMiddleware.js";

const commentsSchema = new mongoose.Schema({
    ...commonFields,
    content: {type: String, required: true},
    images: [String],
    isEdited: {type: Boolean, default: false},
    postID: {type: mongoose.Schema.ObjectId, ref: 'Post', required: true},
    authorID: {type: mongoose.Schema.ObjectId, ref: 'User', required: true}
})

commentsSchema.plugin(globalPostUpdateMiddleware, {modelName: 'Comment'})

const Comment = mongoose.model('Comment', commentsSchema);
export default Comment;