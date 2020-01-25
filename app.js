var express = require("express")
var app = express()

PORT = process.env.PORT || 3000
IP = process.env.IP || "127.0. 0.1"

app.set("view engine", "ejs")
app.use(express.static('public'))

app.get("/", function(req, res){
  res.render("home")
})

app.get("/about", function(req, res){
  res.render("about")
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})
