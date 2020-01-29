var express = require("express")
var app = express()
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))

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
  res.render("contact")
})

const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_PASS = process.env.GMAIL_PASS
const EMAIL_RECIPIENT = process.env.EMAIL_RECIPIENT

console.log("GMAIL_USER", GMAIL_USER)

app.post('/contact', (req, res) => {
  const smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS
    }
  })

  const mailOpts = {
    from: 'Your sender info here',
    to: EMAIL_RECIPIENT,
    subject: 'New message from Align Scoliosis',
    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
  }

  smtpTrans.sendMail(mailOpts, (error, response) => {
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
