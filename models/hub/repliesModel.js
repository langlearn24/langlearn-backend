import mongoose from "mongoose";
import { commonFields } from "../commonFields.js";
import globalPostUpdateMiddleware from "../globalPostUpdateMiddleware.js";

const repliesSchema = mongoose.Schema({
    ...commonFields,
    content: {type: String, required: true},
    images: [String],
    isEdited: {type: Boolean, default: false},
    commentID: {type: mongoose.Schema.ObjectId, ref: 'Comment', required: true},
    authorID: {type: mongoose.Schema.ObjectId, ref: 'User', required: true}
})

repliesSchema.plugin(globalPostUpdateMiddleware, {modelName: 'Reply'})

const Reply = mongoose.model('Reply', repliesSchema);
export default Reply;