import PostReact from "../../models/posts/postReactsModel.js";
import { createOne, deleteOne, getOne, updateOne } from "../global/globalCRUDHandlers.js";

export const getPostReact = getOne(PostReact);
export const createPostReact = createOne(PostReact);
export const updatePostReact = updateOne(PostReact);
export const deletePostReact = deleteOne(PostReact);