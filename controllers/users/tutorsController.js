import mongoose from "mongoose";
import catchAsyncErr from "../../utils/catchAsyncErr.js";
import Tutor from "../../models/users/tutorsModel.js";
import { deleteOne, getAll, getOne, updateOne } from "../global/globalCRUDHandlers.js";

export const updateTutor = updateOne(Tutor);
