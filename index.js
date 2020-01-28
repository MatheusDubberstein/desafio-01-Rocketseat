const express = require("express");
const bodyparser = require("body-parser");
const server = express();

const arr = [];
let countReq = 0;
server.use(bodyparser.json());

server.use((req, res, next) => {
  console.count("Request");
  return next();
});

function verifyId(req, res, next) {
  const { id } = req.params;
  const index = arr.findIndex(item => item.id == id);
  if (!index) {
    return res.status(400).json({ message: "User id is invalid" });
  }
  req.projectIndex = index;
  return next();
}
function verifyExistId(req, res, next) {
  const { id } = req.body;
  const index = arr.findIndex(item => item.id == id);
  if (index !== -1) {
    return res.status(400).json({ message: "User id is exist" });
  }
  return next();
}

server.post("/projects", verifyExistId, (req, res) => {
  const { id, title } = req.body;
  arr.push({ id, title, task: [] });
  return res.status(201).json(arr);
});

server.post("/projects/:id/tasks", verifyId, (req, res) => {
  const { title } = req.body;
  arr[req.projectIndex].task.push(title);
  return res.status(201).json(arr);
});

server.get("/projects", (req, res) => {
  return res.json(arr);
});

server.put("/projects/:id", verifyId, (req, res) => {
  const { title } = req.body;
  arr[req.projectIndex].title = title;
  return res.json(arr);
});

server.delete("/projects/:id", verifyId, (req, res) => {
  arr.splice(req.projectIndex, 1);
  return res.json(arr);
});

server.listen(1709);
