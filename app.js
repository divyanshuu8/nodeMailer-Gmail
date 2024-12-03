const express = require("express");
require("dotenv").config();
const cors = require("cors"); // Import the cors package
const sendMail = require("./controller/sendMail");
const bodyParser = require("body-parser");
const sendMailGD = require("./controller/sendMail-GD-Ent");
const sendMailClient = require("./controller/sendMailClient"); // Import the sendMailClient function
const sendMailFreelancer = require("./controller/SendMailFreelancer");

const port = process.env.PORT || 5001;
const app = express();

/*app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from localhost (for local dev) and your production URL
      const allowedOrigins = [
        "http://localhost:3000",
        "https://dev-divyanshu.netlify.app",
      ];
      if (allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Deny the request
      }
    },
    methods: "GET, POST", // Allow only GET and POST methods
    credentials: true, // Allow credentials (cookies, etc.)
  })
);*/

app.use(cors());



app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("i am server");
});

app.post("/gdent", async (req, res) => {
  // Log the incoming data
  console.log(req.body);

  try {
    // Send emails asynchronously using Promise.all
    // These functions will be executed in parallel without blocking the response
    const sendMailGDEnt = sendMailGD(req.body);

    // Send the response immediately after starting the email sending
    res.status(200).json({ message: "Form submitted successfully!" });

    // Wait for both emails to finish, but don't block the response
    await Promise.all([sendMailGDEnt]);

    console.log("Emails sent successfully!");
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ message: "Internal server error" });
  }
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
    // Send emails asynchronously using Promise.all
    // These functions will be executed in parallel without blocking the response
    const clientEmailPromise = sendMailClient(req.body);
    const freelancerEmailPromise = sendMailFreelancer(req.body);

    // Send the response immediately after starting the email sending
    res.status(200).json({ message: "Form submitted successfully!" });

    // Wait for both emails to finish, but don't block the response
    await Promise.all([clientEmailPromise, freelancerEmailPromise]);

    console.log("Emails sent successfully!");
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
