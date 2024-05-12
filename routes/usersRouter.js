import express from "express";

import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyCode
} from "../controllers/authController.js";
import { deleteUser, getAllUsers, getUser, updateUser } from "../controllers/usersController.js";
const router = express.Router();

// users routes
router.get('/', getAllUsers)
router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser)

// // auth routes
// router.post("/signup", signup);
// router.post("/login", login);
// router.post("/logout", logout);
// router.post("/forgotPassword", forgotPassword);
// router.post("/resetPassword/:token", resetPassword);
// router.post("/sendEmailVerification/", sendEmailVerification);
// router.post("/verifyCode/:verificationCode", verifyCode);


export default router;
