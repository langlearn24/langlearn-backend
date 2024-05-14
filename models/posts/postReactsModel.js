import mongoose from "mongoose";
import { commonFields } from "../commonFields.js";

const postReactsSchema = mongoose.Schema({
    ...commonFields,
    react: {
        type: String,
        enum: ['like', 'love', 'haha', 'angry', 'care'],
        required: true
    },
    postID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: true
    },
    userID: {           // the user who reacts to the post (not the author)
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})

const PostReact = mongoose.model('Post React', postReactsSchema);
export default PostReact;