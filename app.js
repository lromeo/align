var express = require("express")
var app = express()
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser')
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

app.post('/contact', (req, res) => {
  const mailOpts = {
    from: 'lromeo161@gmail.com',
    to: process.env.EMAIL_RECIPIENT,
    subject: 'New message from Align Scoliosis',
    text: `${req.body.name} (${req.body.email} - ${req.body.phone}) says: ${req.body.message}`,
    Source: 'lromeo161@gmail.com'
  }

  transporter.sendMail(mailOpts, (error, response) => {
    if (error) {
      console.log(error)
    } else {
      res.render('contact_success')
    }
  })

})

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
})
