import mongoose from "mongoose";
import catchAsyncErr from "../utils/catchAsyncErr.js";
import Tutor from "../models/tutorsModel.js";
import { deleteOne, getAll, getOne, updateOne } from "./globalCRUDHandlers.js";

export const updateTutor = updateOne(Tutor);
