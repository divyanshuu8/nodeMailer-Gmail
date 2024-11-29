const express = require("express");
require("dotenv").config();
const cors = require("cors"); // Import the cors package
const sendMail = require("./controller/sendMail");
const bodyParser = require("body-parser");
const sendMailClient = require("./controller/sendMailClient"); // Import the sendMailClient function
const sendMailFreelancer = require("./controller/SendMailFreelancer");

let port = 5000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests only from this origin
    methods: "GET,POST", // Allow only GET and POST requests
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("i am server");
});

app.post("/divyanshu", async (req, res) => {
  // Log the incoming data
  console.log(req.body);

  // Check if required fields are present
  const { name, email, mobile, service } = req.body;

  if (!name || !email || !mobile || !service) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    // Call sendMailClient function to send an email to the client
    await sendMailClient(req.body);

    // Call sendMailFreelancer function to send an email to the freelancer
    await sendMailFreelancer(req.body);

    // Send response indicating success
    res
      .status(200)
      .json({ message: "Form submitted and emails sent successfully!" });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//app.get("/mail", sendMail);

const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Live on ${port}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

start();
