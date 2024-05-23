import react from "../../models/posts/reactsModel.js";
import { createOne, deleteOne, getOne, updateOne } from "../global/globalCRUDHandlers.js";

export const getReact = getOne(react);
export const createReact = createOne(react);
export const updateReact = updateOne(react);
export const deleteReact = deleteOne(react);