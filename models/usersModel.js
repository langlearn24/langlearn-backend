import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {commonFields} from './baseSchema.js'; 
const userSchema = mongoose.Schema({
  ...commonFields,
  firstName: {
    type: String,
    required: [true, "You must provide a first name"],
  },
  lastName: String,
  email: {
    type: String,
    validate: [validator.isEmail, "Please provide a valid email"],
    unique: [true, "This email already exist. Please login!"],
  },
  password: {
    type: String,
    minLength: 12,
    required: [true, "You must provide a password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "You must confirm your password"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords are not matching!",
    },
    select: false,
  },
  passwordResetToken: String,
  passwordResetTokenExpiry: String,
  image: String,
  Bio: String,
  Role: {
    type: String,
    enum: ['learner', 'tutor', 'admin']
  },
  // TODO: implement Language and Address models
  // languages: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Language'
  // }, 
  // address: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Address'
  // },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoggedInAt: Date,
  joinedAt: Date
});

userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) return next();

  // Hash user password before saving the document
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePasswords = async function (
  inputPassowrd,
  userPassword
) {
  return bcrypt.compare(inputPassowrd, userPassword);
};

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log('hashed token saved db: ', this.passwordResetToken)
  console.log('unhashed token returned by generation: ', resetToken)
  // expires in 10 minutes
  this.passwordResetTokenExpiry = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
