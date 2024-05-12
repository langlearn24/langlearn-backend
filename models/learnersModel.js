import mongoose from "mongoose";
import User from "./usersModel.js";

const learnerSchema = new mongoose.Schema({
    friends: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  });
  
const Learner = User.discriminator('learner', learnerSchema);
export default Learner;