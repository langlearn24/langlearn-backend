import mongoose from "mongoose";

export const commonFields = {
    createdAt: {
        type: Date,
        default: new Date(Date.now())
    },
    lastModifiedAt: Date,
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    lastModifiedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
}