import mongoose from "mongoose";
import catchAsyncErr from "../../utils/catchAsyncErr.js";
import Learner from "../../models/users/learnersModel.js";
import { deleteOne, getAll, getOne, updateOne } from "../global/globalCRUDHandlers.js";

export const updateLearner = updateOne(Learner);
