import mongoose from "mongoose";
import { commonFields } from "./commonFields.js";

const addressSchema = new mongoose.Schema({
  ...commonFields,
    country: String,
    state: String
  });
  
  const Address = mongoose.model("Address", addressSchema);
  export default Address;
  