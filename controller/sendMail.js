const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const xlsx = require('xlsx');  // Add xlsx to read Excel files

// Read the email template
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

// Function to read names and emails from Excel file
const getEmailsAndNamesFromExcel = (filePath) => {
    const workbook = xlsx.readFile(filePath);  // Read the Excel file
    const sheetName = workbook.SheetNames[0];  // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];

    const emailData = xlsx.utils.sheet_to_json(worksheet);  // Convert sheet to JSON format
    const emailToNameMap = {};  // Object to store email to name mapping

    // Populate the mapping
    emailData.forEach(row => {
        if (row.Name && row.Email) {
            emailToNameMap[row.Email.trim()] = row.Name.trim();
        }
    });

    return emailToNameMap; // Return the mapping of emails to names
};

// Modify the sendMail function to get names
const sendMail = async (req, res) => {
    try {
        // Path to the Excel file containing emails and names
        const excelFilePath = path.join(__dirname, '../assets/emailList.xlsx');
        const emailToNameMap = getEmailsAndNamesFromExcel(excelFilePath);
        const emailList = Object.keys(emailToNameMap); // Get the list of emails

        // Define the path to the PDF file
        const pdfPath = path.join(__dirname, '../assets/Resume_Divyanshu.pdf');

        // Loop through each email in the list and send emails
        for (const email of emailList) {
            try {
                // Extract the recipient's name from the email map
                const recipientName = emailToNameMap[email] || "Applicant";

                // Create a personalized email template for the recipient
                const personalizedTemplate = emailTemplate.replace("{{name}}", recipientName);

                // Define email options with an attachment for each recipient
                const mailOptions = {
                    from: process.env.GMAIL_USER, // Sender address
                    to: email, // Recipient email address
                    subject: 'Application for Internship', // Subject
                    html: personalizedTemplate, // Personalized email body
                    attachments: [
                        {
                            filename: 'Resume_Divyanshu.pdf', // Name of the attached file
                            path: pdfPath, // Path to the file on the system
                            contentType: 'application/pdf' // MIME type for the PDF
                        }
                    ]
                };

                // Send email to the current recipient
                await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${email}`);
            } catch (emailError) {
                console.error(`Error sending email to ${email}:`, emailError.message);
            }
        }

        res.send("Emails sent successfully via Gmail to all recipients with a PDF attachment!");
    } catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).send("Error sending emails");
    }
};

module.exports = sendMail;
