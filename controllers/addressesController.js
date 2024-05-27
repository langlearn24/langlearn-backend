import Address from "../models/addressModel.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./global/globalCRUDHandlers.js";

export const getAllAddresses = getAll(Address);
export const getAddress = getOne(Address);
export const createAddress = createOne(Address);
export const updateAddress = updateOne(Address);
export const deleteAddress = deleteOne(Address);