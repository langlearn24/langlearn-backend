import mongoose from "mongoose";
import { commonFields } from "../commonFields.js";

const reactsSchema = mongoose.Schema({
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
    // TODO: implement the Comment & Reply models
    // commentID: {
        // type: mongoose.Schema.ObjectId,
        // ref: 'Comment',
        // required: true
    // },
    // replyID: {
        // type: mongoose.Schema.ObjectId,
        // ref: 'Reply',
        // required: true
    // },
    userID: {           // the user who reacts to the post (not the author)
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})

const React = mongoose.model('React', reactsSchema);
export default React;