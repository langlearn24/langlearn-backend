import jwt from "jsonwebtoken";
import catchAsyncErr from "../utils/catchAsyncErr.js";
import User from "../models/usersModel.js";
import AppError from "../utils/appError.js";
import sendEmail from "../utils/sendEmail.js";

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const sendToken = (message, statusCode, res, user) => {
  const token = signToken(user.id);
  res.cookie("jwt", token, {
    httpOnly: true,
  });

  res.status(statusCode).json({
    status: "success",
    message,
    token,
    user,
  });
};

export const signup = catchAsyncErr(async (req, res, next) => {
  const data = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  };

  const user = await User.create(data);

  sendToken("User created successfully", 201, res, user);
});

export const login = catchAsyncErr(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  console.log(user);

  if (!email || !password) {
    return next(
      new AppError("Please provide both an email and a password", 400)
    );
  }
  if (!user)
    return next(new AppError("We can't find this email. Please sign up!", 404));

  if (!(await user.comparePasswords(password, user.password))) {
    return next(new AppError("Invalid credentials!", 401));
  }

  sendToken("Successful login", 200, res, user);
});

export const logout = catchAsyncErr(async (req, res, next) => {
  const { email } = req.body;
  const user = User.findOne({ email });

  res.cookie("jwt", "");
  res.status(200).json({
    status: "success",
    message: "Successful logout",
  });
});

export const forgotPassword = catchAsyncErr(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(
      new AppError(
        "You are trying to reset the password of non existant account",
        400
      )
    );

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetPassword/${resetToken}`;

  const emailTxt = `Please follow this link to reset your password: ${resetUrl}`;

  // TODO: fix the bug that is causing sending emails to fail
  try{
      await sendEmail({
        email: user.email,
        subject: "Password reset",
        text: emailTxt,
      });
    
      res.status(200).json({
        status: 'success',
        message: 'Password reset email sent successfully'
      })
  } catch(err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err)

    res.status(500).json({
        status: 'fail',
        message: 'Error while sending the email',
    })
  }
});

// TODO: implement a resetPassword API
