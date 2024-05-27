import mongoose from "mongoose";
import catchAsyncErr from "../../utils/catchAsyncErr.js";
import User from "../../models/users/usersModel.js";
import { deleteOne, getAll, getOne, updateOne } from "../global/globalCRUDHandlers.js";

export const getAllUsers = getAll(User);
export const getUser = getOne(User);
export const deleteUser = deleteOne(User);
export const updateUser = updateOne(User);
