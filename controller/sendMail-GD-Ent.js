const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const emailTemplateClient = fs.readFileSync(
  path.join(__dirname, "../assets/GD-Template.html"),
  "utf8"
);

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GD_USER,
    pass: process.env.GD_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMailGD = async (data) => {
  const { name, email, message } = data;

  // Prepare personalized email content for the client
  const personalizedTemplate = emailTemplateClient.replace("{{name}}", name);

  const mailOptions = {
    from: process.env.GD_USER,
    to: email,
    subject: `TRIAL-NODEMAILER`,
    html: personalizedTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    throw error; // Re-throw the error for handling in the main function
  }
};

module.exports = sendMailGD;
