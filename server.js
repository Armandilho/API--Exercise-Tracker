const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Conectou no banco, na porta 3000!");
});

app.get("/", (req, res) => {
  res.json({ teste: "entrada" });
});
