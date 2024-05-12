import catchAsyncErr from "./catchAsyncErr";
const client = require("twilio")(process.env.ACC_SID, process.env.AUTH_TOKEN);

const sendSMS = catchAsyncErr(async ({phone, body}) => {
  client.messages
    .create({
      body,
      to: phone, // Text your number
      from: process.env.PHONE_NUMBER, // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));
});

export default sendSMS;
