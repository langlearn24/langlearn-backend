import nodemailer from"nodemailer";
import catchAsyncErr from"./catchAsyncErr.js";

const sendEmail = catchAsyncErr(async(options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.PASS,
    },
  });

  const emailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  try{
    await transporter.sendMail(emailOptions);
    console.log('Password reset email sent to', emailOptions.to)
  } catch(err) {
    console.log('email not sent')
    console.log(err)
  }
});

export default sendEmail;
