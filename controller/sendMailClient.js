const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const emailTemplateClient = fs.readFileSync(
  path.join(__dirname, "../assets/freelanceTemplate.html"),
  "utf8"
);

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMailClient = async (data) => {
  const { name, email, mobile, service } = data;

  // Prepare personalized email content for the client
  const personalizedTemplate = emailTemplateClient
    .replace("{{name}}", name)
    .replace("{{email}}", email)
    .replace("{{mobile}}", mobile)
    .replace("{{service}}", service);

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: "workwithdivyanshu@outlook.com",
    subject: `Service Request Confirmation`,
    html: personalizedTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Client email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    throw error; // Re-throw the error for handling in the main function
  }
};

module.exports = sendMailClient;
