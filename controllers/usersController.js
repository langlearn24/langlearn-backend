import mongoose from "mongoose";
import catchAsyncErr from "../utils/catchAsyncErr.js";
import User from "../models/usersModel.js";

export const getAllUsers = catchAsyncErr(async(req, res, next) => {
    const users = await User.find();
    // TODO: add a global middleware handler for all CRUD operations
    res.status(200).json({
        status: 'success',
        users
    })
})