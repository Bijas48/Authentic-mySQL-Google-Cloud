const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "FinancyQ - Kata Kata Hari ini",
    link: "https://mailgen.js/",
  },
});

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "financyqworkspace@gmail.com",
    pass: "cymi ejxi vmcw vkag",
  },
});

async function sendingmail(email, otp) {
  try {
    const emailTemplate = {
      body: {
        name: `Hello User`,
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

    // Generate an HTML email with the provided template
    const emailBody = mailGenerator.generate(emailTemplate);

    // Mail options
    const mailOptions = {
      from: "financyqworkspace@gmail.com",
      to: email,
      subject: "Your OTP Code",
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

module.exports = { sendingmail };
