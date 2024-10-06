const express = require('express');
require('dotenv').config();


const sendMail = require('./controller/sendMail')
let port = 5000;

const app = express();

app.get("/", (req,res) => {
  res.send("i am server");
})

app.get("/mail", sendMail)

const start = async( ) => {
  try {
    app.listen(port, ()=> {
      console.log(`Live on ${port}`)
    });
  } catch (error){
    console.log(error.message);
  }
};

start();