const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const generateOTP = require("./otp");

// Configure mailgen by setting a theme and your product info
let name = "testing";
var otp = generateOTP();

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "FinancyQ - Kata Kata Hari ini",
    link: "https://mailgen.js/",
  },
});

const emailTemplate = {
  body: {
    name: `Hello ${name}`,
    intro: "Welcome to FinancyQ.",
    action: {
      instructions: "Please input this OTP code number:",
      button: {
        color: "#22BC66", // Color of the button
        text: `${otp}`, // Text of the button
      },
    },
    outro:
      "Need help, or have questions? Just reply to this email, we'd love to help.",
  },
};

//batasan

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "financyqworkspace@gmail.com",
    pass: "cymi ejxi vmcw vkag",
  },
});

// var mailOptions = {
//   from: process.env.EMAIL, //ini kedetect
//   to: "bijaske2@gmail.com",
//   subject: "Sending Email using Node.js",
//   text: "That was easy ya kan!",
//   html: "<b>Hello world?</b>",
// };

// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Email sent: " + info.response);
//     console.log(nodemailer.getTestMessageUrl(mailOptions));
//   }
// });

async function sendMailWithTemplate(email) {
  try {
    // Generate an HTML email with the provided template
    const emailBody = mailGenerator.generate(emailTemplate);

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to FinancyQ",
      html: emailBody,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    console.log(nodemailer.getTestMessageUrl(mailOptions));
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
}

// Tetsing
const recipientEmail = "bijaske2@gmail.com";
sendMailWithTemplate(recipientEmail);
