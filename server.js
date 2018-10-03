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

const Names = mongoose.model("naame", User);
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
    index: true
  }
});

const descrOfExerc = mongoose.model("exeercise", Exercises);

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
    });
  }
});

//2 - Show all regitred users
app.get("/api/exercise/users", async (req, res) => {
  const arrayquer = await Names.find();
  res.json(arrayquer);
});

//3 - add an exercise
app.post("/api/exercise/add", async (req, res) => {
  const { exerciseId, exerciseName, exerciseDuration, exerciseDate } = req.body;
  const arrayquer = await Names.find({ _id: exerciseId });
  //Before the registering , i will search the database for possible matches. If something is
  //found(A valid ID), i will create a model and insert into the mongodb database.
  if (arrayquer.length != 0) {
    const name = arrayquer[0].name;
    const id = arrayquer[0]._id;

    if (exerciseDate === "") {
      exercicio = await descrOfExerc.create({
        username: name,
        description: exerciseName,
        duration: exerciseDuration,
        userId: id
      });
      //Here i format the date to fit into the patterns of the exercise, in that case
      //i will use the default date of my schema
      dateString = new Date(exercicio.date).toUTCString();
      dateString = dateString
        .split(" ")
        .slice(0, 4)
        .join(" ");
      //*******/
      res.json({
        username: name,
        description: exerciseName,
        duration: exerciseDuration,
        _id: id,
        date: dateString
      });
    } else {
      //Here i format the date to fit into the patterns of the exercise, here i will
      //use the inserted date on body.paramater
      dateString = new Date(exerciseDate).toUTCString();
      dateString = dateString
        .split(" ")
        .slice(0, 4)
        .join(" ");
      //*******/

      if (dateString === "Invalid Date") {
        res.json({ error: "invalida date" });
      } else {
        await descrOfExerc.create({
          username: name,
          description: exerciseName,
          duration: exerciseDuration,
          userId: id,
          date: dateString
        });
        res.json({
          username: name,
          description: exerciseName,
          duration: exerciseDuration,
          _id: id,
          date: dateString
        });
      }
    }
  } else {
    res.json({ error: "this id does not exist in the database" });
  }
});

//4 - Query information about the users
app.get("/api/exercise/:userid", async (req, res) => {
  const id = req.params.userid;

  const arrayquer = await descrOfExerc.find({ userId: id });
  const arrayquerteste = await descrOfExerc
    .find({ userId: id })
    .select("-_id description duration date");
  //REMEMBER : put the date in utc format

  //I only want some parts of the query, so i will create another object with the atrtibutes
  //what i want ans send it as response.
  result = {
    _id: arrayquer[0].userId,
    username: arrayquer[0].username,
    count: arrayquer.length,
    log: arrayquerteste
  };

  res.json({
    result
  });
  //Criar um objeto chamado query e depois usar seus atributos para serem inseridos na query.
});
