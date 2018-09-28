const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const randomstring = require("randomstring");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//Conection to localhost
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Conectou no localhost, na porta 3000!");
});
//******/

//Mongoose conection
mongoose.connect(
  "mongodb://localhost/test",
  { useNewUrlParser: true }
);
//******/

//Creating Schema
const Schema = mongoose.Schema;

const User = new Schema({
  name: String
});

const Names = mongoose.model("Name", User);
//******/

app.get("/", (req, res) => res.sendFile("public/index.html"));

//1 - Register in dataBase
app.post("/exercise/new-user", async (req, res) => {
  const { username } = req.body;
  const arrayquer = await Names.find({ name: username });
  //Before the registering , i will search the database for possible matches.
  //if there is no match, the return of find() will be a empty array "[]"
  //soo the array.length will be equal to 0, if something is found the length will be different
  //from 0.
  if (arrayquer.length != 0) {
    res.json({ error: "username alredy regitred" });
  } else {
    const id_generated = randomstring.generate(7);
    await Names.create({
      name: username,
      id: id_generated
    });
    res.json({
      name: username,
      id: id_generated
    });
  }
});

//2 - Show all regitred users
app.get("/api/exercise/users", async (req, res) => {
  const arrayquer = await Names.find({ __v: 0 });
  console.log(arrayquer);
});
