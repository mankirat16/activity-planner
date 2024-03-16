const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["POST"],
    optionsSuccessStatus: 200,
  })
);
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static("."));
const PORT = 6090;
let tasks = JSON.parse(fs.readFileSync("./tasks.json", "utf8")) || [];
app.post("/add", (req, res) => {
  console.log(req.body);
  const newTask = {
    text: req.body.text,
    id: req.body.id,
  };
  tasks.push(newTask);
  fs.writeFileSync("./tasks.json", JSON.stringify(tasks));
  res.send("added task");
});
app.post("/delTask", (req, res) => {
  tasks = tasks.filter((task) => {
    return task.id != req.body.id;
  });
  console.log(tasks);
  fs.writeFileSync("./tasks.json", JSON.stringify(tasks));
  res.send("Delted task");
});
app.get("/getTasks", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(JSON.stringify(tasks));
});
app.post("/updateTask", (req, res) => {
  let data = fs.readFileSync("./tasks.json", "UTF-8");
  console.log(typeof req.body);
  data = JSON.parse(data);
  data.forEach((item) => {
    if (item.id === req.body.id) {
      item.text = req.body.text;
    }
  });
  fs.writeFileSync("./tasks.json", JSON.stringify(data));
});
app.listen(PORT, (err) => {
  if (!err) {
    console.log("Server listening on " + PORT);
  } else {
    console.log(err);
    return;
  }
});
