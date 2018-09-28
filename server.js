const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//Mongoose conection
mongoose.connect(
  "mongodb://localhost:27017/bancoapi",
  { useNewUrlParser: true }
);
//******/

//Conection to localhost
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Conectou no banco, na porta 3000!");
});
//******/

app.get("/", (req, res) => res.sendFile("public/index.html"));
