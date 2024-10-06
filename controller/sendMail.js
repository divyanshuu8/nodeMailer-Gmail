const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const emailTemplate = fs.readFileSync(path.join(__dirname, '../assets/emailTemplate.html'), 'utf8');

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // Gmail SMTP server
    port: 587,               // Use port 587 for TLS
    secure: false,           // Use TLS (false because we are using STARTTLS, which upgrades the connection)
    auth: {
        user: process.env.GMAIL_USER, // Your Gmail email
        pass: process.env.GMAIL_PASS, // Your Gmail app password
    },
    tls: {
        rejectUnauthorized: false  // Allow self-signed certificates (useful for development)
    }
});

const sendMail = async (req, res) => {
    try {
        // Define email options
        const mailOptions = {
            from: process.env.GMAIL_USER, // Sender address
            to: 'harshad622004fozdar@gmail.com',    // Recipient email address
            subject: 'Hello from Nodemailer (Gmail)', // Subject
            html: emailTemplate, // Email body
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.send("Mail sent successfully via Gmail!");
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
    }
}

module.exports = sendMail;
