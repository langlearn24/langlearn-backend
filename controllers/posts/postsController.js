import Post from "../../models/posts/postsModel.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "../global/globalCRUDHandlers.js";

export const getAllPosts = getAll(Post);
export const getPost = getOne(Post);
export const createPost = createOne(Post);
export const updatePost = updateOne(Post);
export const deletePost = deleteOne(Post);