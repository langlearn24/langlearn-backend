import express from "express";

import {
  signup,
  login,
  logout,
  forgotPassword,
} from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgotPassword", forgotPassword);

export default router;
