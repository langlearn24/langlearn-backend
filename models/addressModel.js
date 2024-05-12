import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    country: String,
    state: String
  });
  
  const Address = mongoose.model("Address", addressSchema);
  export default Address;
  