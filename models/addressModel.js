import mongoose from "mongoose";
import { commonFields } from "./commonFields.js";
import globalPostUpdateMiddleware from "./globalPostUpdateMiddleware.js";

const addressSchema = new mongoose.Schema({
  ...commonFields,
    country: String,
    state: String,
    userID: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  });
  addressSchema.plugin(globalPostUpdateMiddleware)
  const Address = mongoose.model("Address", addressSchema);
  export default Address;
  