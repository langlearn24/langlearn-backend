import express from "express";

import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyCode
} from "../../controllers/users/authController.js";
const router = express.Router();

// auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);
router.post("/sendEmailVerification/", sendEmailVerification);
router.post("/verifyCode/:verificationCode", verifyCode);


export default router;
