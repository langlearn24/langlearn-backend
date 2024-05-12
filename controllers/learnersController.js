import mongoose from "mongoose";
import catchAsyncErr from "../utils/catchAsyncErr.js";
import Learner from "../models/learnersModel.js";
import { deleteOne, getAll, getOne, updateOne } from "./globalCRUDHandlers.js";

export const updateLearner = updateOne(Learner);
