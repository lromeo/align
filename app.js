var express = require("express")
var app = express()
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser')
const axios = require("axios");
var sslRedirect = require('heroku-ssl-redirect');
var AWS = require("aws-sdk");

app.use(bodyParser.urlencoded({extended: true}))

app.use(sslRedirect());

if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}

app.set("view engine", "ejs")
app.use(express.static('public'))

app.get("/", function(req, res){
  res.render("home")
})

app.get("/about", function(req, res){
  res.render("about")
})

app.get("/contact", function(req, res){
  google_api = "https://maps.googleapis.com/maps/api/js?key=" + process.env.GOOGLE_MAPS_API_KEY + "&callback=initMap"
  res.render("contact", { google_api })
})

app.get("/testimonials", function(req, res){
  res.render("testimonials")
})

app.get("/schroth", function(req, res){
  res.render("schroth")
})

app.get("/accelerated", function(req, res){
  res.render("accelerated")
})

app.get("/standard", function(req, res){
  res.render("standard")
})

app.get("/faq", function(req, res){
  res.render("faq")
})

AWS.config.update({region: 'us-west-2'});

// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
  SES: new AWS.SES({
      apiVersion: '2010-12-01'
  })
});

const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

app.post('/contact', async (req, res) => {
  const token = req.body['g-recaptcha-response'];

  if (!token) {
    return res.status(400).json({ message: 'CAPTCHA token is missing' });
  }

  try {
    // Verify the CAPTCHA token
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: SECRET_KEY,
        response: token,
      },
    });

    const mailOpts = {
      from: 'lromeo161@gmail.com',
      to: process.env.EMAIL_RECIPIENT,
      subject: 'New message from Align Scoliosis',
      text: `${req.body.name} (${req.body.email} - ${req.body.phone}) says: ${req.body.message}`,
      Source: 'lromeo161@gmail.com'
    }

    const { success, score } = response.data;

    if (success) {
      transporter.sendMail(mailOpts, (error, response) => {
        if (error) {
          console.log(error)
        } else {
          res.render('contact_success')
        }
      })
    } else {
      res.status(400).json({ message: 'CAPTCHA verification failed' });
    }
  } catch (error) {
    console.error('Error verifying CAPTCHA:', error);
    res.status(500).json({ message: 'Server error' });
  }
})

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
})
