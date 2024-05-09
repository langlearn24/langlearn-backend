import express from "express";

import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { getAllUsers } from "../controllers/usersController.js";
const router = express.Router();

router.get('/', getAllUsers)

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);


export default router;
