import mongoose from "mongoose";
import User from "./usersModel.js";

const tutorSchema = new mongoose.Schema({
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    teachesAt: String
  });
  
const Tutor = User.discriminator('tutor', tutorSchema);
export default Tutor;