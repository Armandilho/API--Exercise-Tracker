const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const shortid = require("shortid");

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

//Creating USER Schema
const Schema = mongoose.Schema;

const User = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  name: String
});

const Names = mongoose.model("Name", User);
//******/

//Creating Exercise Schema
const Exercises = new Schema({
  description: {
    type: String,
    required: true,
    maxlength: [20, "description too long"]
  },
  duration: {
    type: Number,
    required: true,
    min: [1, "duration too short"]
  },
  date: {
    type: Date,
    default: Date.now
  },
  username: String,
  userId: {
    type: String,
    ref: "Users",
    index: true
  }
});

const nameExercises = mongoose.model("Exercise", Exercises);

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
    usuario = await Names.create({
      name: username
    });
    res.json({
      name: usuario.name,
      id: usuario._id
      //i need to get the ID from schema and put here
    });
  }
});

//2 - Show all regitred users
app.get("/api/exercise/users", async (req, res) => {
  const arrayquer = await Names.find();
  res.json(arrayquer);
});

//3 - add an exercise
app.post("/add", async (req, res) => {
  const { exerciseId, exerciseName, exerciseDuration, exerciseDate } = req.body;
  const arrayquer = await Names.find({ _id: exerciseId });
  console.log(arrayquer);
  //Before the registering , i will search the database for possible matches.
  if (arrayquer.length != 0) {
  } else {
    res.json({ error: "this id does not exist in the database" });
  }
});
