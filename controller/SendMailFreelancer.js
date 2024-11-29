const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const emailTemplate = fs.readFileSync(
  path.join(__dirname, "../assets/clientTemplate.html"),
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

const sendMailFreelancer = async (data) => {
  const { name, email, mobile, service } = data;

  // Prepare personalized email content for the freelancer
  let personalizedTemplate = emailTemplate
    .replace("{{Customer's Name}}", name)
    .replace("{{business website development}}", service)
    .replace("{{Your Contact Number}}", process.env.DIVYANSHU_MOBILE)
    .replace("{{Your Email Address}}", "workwithdivyanshu@outlook.com") // assuming you want to use the Gmail user as the contact
    .replace("{{Your Name}}", "Divyanshu Singh") // You can set this to any desired name
    .replace("{{Your Business Name}}", "Your Business Name Here"); // Replace with your business name

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: `📨 We Got Your Request! 🚀`,
    html: personalizedTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Freelancer email sent to ${process.env.FREELANCER_EMAIL}`);
  } catch (error) {
    console.error(`Error sending email to freelancer:`, error);
    throw error; // Re-throw the error for handling in the main function
  }
};

module.exports = sendMailFreelancer;
