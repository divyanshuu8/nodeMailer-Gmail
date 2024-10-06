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

// Function to read emails from Excel file
const getEmailsFromExcel = (filePath) => {
    const workbook = xlsx.readFile(filePath);  // Read the Excel file
    const sheetName = workbook.SheetNames[0];  // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];

    const emailData = xlsx.utils.sheet_to_json(worksheet);  // Convert sheet to JSON format
    return emailData.map(row => row.Email);  // Assuming the column header for emails is 'Email'
};

const sendMail = async (req, res) => {
    try {
        // Path to the Excel file containing emails
        const excelFilePath = path.join(__dirname, '../assets/emailList.xlsx');
        const emailList = getEmailsFromExcel(excelFilePath);

        // Define the path to the PDF file
        const pdfPath = path.join(__dirname, '../assets/Resume_Divyanshu.pdf');

        // Loop through each email in the list and send emails
        for (const email of emailList) {
            try {
                // Define email options with an attachment for each recipient
                const mailOptions = {
                    from: process.env.GMAIL_USER,                // Sender address
                    to: email,                                   // Recipient email address
                    subject: 'Application for Full-Stack Web Development Internship',    // Subject
                    html: emailTemplate,                        // Email body
                    attachments: [
                        {
                            filename: 'Resume_Divyanshu.pdf',   // Name of the attached file
                            path: pdfPath,                     // Path to the file on the system
                            contentType: 'application/pdf'      // MIME type for the PDF
                        }
                    ]
                };

                // Send email to the current recipient
                await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${email}`);
            } catch (emailError) {
                console.error(`Error sending email to ${email}:`, emailError.message);
                // Optionally, you can send a response back for this email failure
                // res.status(500).send(`Error sending email to ${email}`);
            }
        }

        res.send("Emails sent successfully via Gmail to all recipients with a PDF attachment!");
    } catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).send("Error sending emails");
    }
};

module.exports = sendMail;
