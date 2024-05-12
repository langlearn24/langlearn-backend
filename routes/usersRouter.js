import express from "express";

import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmail
} from "../controllers/authController.js";
import { getAllUsers } from "../controllers/usersController.js";
const router = express.Router();

router.get('/', getAllUsers)

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);
router.post("/sendEmailVerification/", sendEmailVerification);
router.post("/verifyEmail/:verificationCode", verifyEmail);


export default router;
