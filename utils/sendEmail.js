const nodemailer = require("nodemailer");
const catchAsyncErr = require("./catchAsyncErr");
const { HOST, PORT, USER, PASS } = process.env;

const sendEmail = catchAsyncErr(async(options) => {
  const transporter = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    auth: {
      user: USER,
      pass: PASS,
    },
  });

  const emailOptions = {
    from: USER,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(emailOptions);
});

module.exports = sendEmail;
