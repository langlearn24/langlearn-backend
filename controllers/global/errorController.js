import AppError from "../../utils/appError.js";

const handleDuplicationError = (err) => {
  const duplicatedField = Object.keys(err.keyValue)[0];
  const message = `This ${duplicatedField}: ${err.keyValue[duplicatedField]} already exists!`;
  return new AppError(message, 400);
};
const handleCastErrors = (errMsg) => {
  const err = new AppError(errMsg, 400);
  return err;
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  const errors = err.errors && err.errors;
  const errMsgs = errors && Object.values(errors).map((el) => el.message);
  // handling DB duplicate key errors
  if (err.code === 11000) err = handleDuplicationError(err);
  //   handling DB cast errors and validation errors
  if (
    errors &&
    (errMsgs[0].endsWith('"CastError"') ||
      errors[Object.keys(errors)[0]].name === "ValidatorError")
  ) {
    err = handleCastErrors(errMsgs[0]);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
