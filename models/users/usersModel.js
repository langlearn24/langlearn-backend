import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { commonFields } from "../commonFields.js";
import { phone } from "phone";
import globalPostUpdateMiddleware from "../globalPostUpdateMiddleware.js";

const userSchema = new mongoose.Schema(
  {
    ...commonFields,
    firstName: {
      type: String,
      required: [true, "You must provide a first name"],
      unique: true
    },
    lastName: String,
    email: {
      type: String,
      validate: [validator.isEmail, "Please provide a valid email"],
      unique: true,
    },
    phone: {
      type: String,
      validate: {
        validator: function (phoneNumber) {
          const countryIso3 = phone(phoneNumber).countryIso3;
          return phone(phoneNumber, { country: countryIso3 }).isValid;
        },
        message: "Invalid phone number",
      },
      unique: [true, "This phone number already exists. Please login!"],
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
    passwordChangedAt: Date,
    image: String, // TODO: set up an images storage server
    bio: String,
    role: {
      type: String,
      enum: ["learner", "tutor", "admin"],
      required: [true, 'Creating an account without role is not allowed']
    },
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    languages: [{
      language: {
        type: String,
        required: [true, 'You must have at least 1 language']
      },
      proficiency: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Fluent', 'Native']
      }
    }],
    address: {
      type: mongoose.Schema.ObjectId,
      ref: 'Address'
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoggedInAt: Date,
    joinedAt: Date,
  },
  { discriminatorKey: "role", collection: "users" }
);

userSchema.plugin(globalPostUpdateMiddleware)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

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
  console.log("hashed token saved db: ", this.passwordResetToken);
  console.log("unhashed token returned by generation: ", resetToken);
  // expires in 10 minutes
  this.passwordResetTokenExpiry = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.isPasswordChangedAfterToken = function(tokenIssuanceTime){
  const passwordChangedTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
  return passwordChangedTime > tokenIssuanceTime
}

const User = mongoose.model("User", userSchema);
export default User;
