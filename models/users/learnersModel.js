import mongoose from "mongoose";
import User from "./usersModel.js";

const learnerSchema = new mongoose.Schema({
  });
  
const Learner = User.discriminator('learner', learnerSchema);
export default Learner;