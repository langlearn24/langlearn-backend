import mongoose from "mongoose";
import User from "./usersModel.js";

const tutorSchema = new mongoose.Schema({

  });
  
const Tutor = User.discriminator('tutor', tutorSchema);
export default Tutor;