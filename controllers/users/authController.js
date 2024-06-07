import jwt from "jsonwebtoken";
import catchAsyncErr from "../../utils/catchAsyncErr.js";
import User from "../../models/users/usersModel.js";
import AppError from "../../utils/appError.js";
import sendEmail from "../../utils/sendEmail.js";
import crypto from "crypto";
import sendSMS from "../../utils/sendSMS.js";
import Learner from "../../models/users/learnersModel.js";
import Tutor from "../../models/users/tutorsModel.js";
import { promisify } from "util";

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
  let userType;
  if (req.body.role === "Learner") {
    userType = Learner;
  } else if (req.body.role === "Tutor") {
    userType = Tutor;
  } else {
    userType = User;
  }
  const user = await userType.create(req.body);
  // const user = await User.create(req.body);
  user.joinedAt = new Date(Date.now());
  user.createdBy = user.id;
  sendToken("User created successfully", 201, res, user);
});

export const login = catchAsyncErr(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

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

  user.lastLoggedInAt = new Date(Date.now());
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

export const protect = catchAsyncErr(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in first,", 400)
    );
  }
  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  // 4) Check if user changed password after the token was issued
  const isPasswordChanged = user.isPasswordChangedAfterToken(decoded.iat);
  if (isPasswordChanged) {
    return next(
      new AppError("Your password has changed, please login again!", 401)
    );
  }
  // 5) GRANT ACCESS TO PROTECTED ROUTE
  req.user = user;
  next();
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

  const emailText = `Please follow this link to reset your password: ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset",
      message: emailText,
    });

    res.status(200).json({
      status: "success",
      message: "Password reset email sent successfully",
      token: resetToken,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);

    res.status(500).json({
      status: "fail",
      message: "Error while sending the email",
    });
  }
});

export const resetPassword = catchAsyncErr(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or expired token", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.lastModifiedAt = new Date(Date.now());
  user.lastModifiedBy = user.id;
  user.passwordChangedAt = new Date(Date.now());
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiry = undefined;

  await user.save({ validateBeforeSave: true });
  sendToken("Password reset successfully", 200, res, user);
});

export const sendEmailVerification = catchAsyncErr(async (req, res, next) => {
  const { email } = req.body;
  const verificationCode = Math.floor(1000000 + Math.random() * 900000);
  const emailText = `Here is your verification code:\n${verificationCode}`;
  try {
    await sendEmail({
      email,
      subject: "Verify your email",
      message: emailText,
    });

    res.status(200).json({
      status: "success",
      message: "Email verification email sent successfully",
      verificationCode,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Error while sending the email",
    });
  }
});

// TODO: test SMS verification API after discussing the
// Twilio (or any other avialable option) payment
export const sendPhoneVerification = catchAsyncErr(async (req, res, next) => {
  const { phone } = req.body;
  const verificationCode = Math.floor(1000000 + Math.random() * 900000);
  const smsText = `Here is your verification code:\n${verificationCode}`;
  try {
    sendSMS({
      phone,
      body: smsText,
    });

    res.status(200).json({
      status: "success",
      body: "Verification SMS sent to your number",
      verificationCode,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Error while sending SMS",
    });
  }
});

export const verifyCode = catchAsyncErr(async (req, res, next) => {
  const inputVerificationCode = req.body.inputVerificationCode;
  const verificationCode = req.params.verificationCode;

  if (inputVerificationCode !== verificationCode) {
    return next(
      new AppError(
        "Incorrect verification code. Please double check your email!",
        400
      )
    );
  } else {
    res.status(200).json({
      status: "success",
      message: "Your email has been verified!",
    });
  }
});
