import mongoose from "mongoose";
import catchAsyncErr from "../utils/catchAsyncErr.js";
import User from "../models/usersModel.js";
import { deleteOne, getAll, getOne, updateOne } from "./globalCRUDHandlers.js";

export const getAllUsers = getAll(User);
export const getOneUser = getOne(User);
export const deleteOneUser = deleteOne(User);
export const updateOneUser = updateOne(User);
