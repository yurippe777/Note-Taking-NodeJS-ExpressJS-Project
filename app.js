const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  let rawData = fs.readFileSync("notes.json");
  let data = JSON.parse(rawData);
  res.render("home", { data });
});

app.post("/update", (req, res) => {
  let noteId = req.body.noteId;
  let noteContent = req.body.noteContent;
  let rawData = fs.readFileSync("notes.json");
  let data = JSON.parse(rawData);

  if (noteId) {
    // Update an existing note
    let noteIndex = data.findIndex((note) => note.noteId == noteId);
    data[noteIndex].noteContent = noteContent;
  } else {
    // Add a new note
    let newNote = {
      noteId: data.length + 1,
      noteContent: noteContent,
    };
    data.push(newNote);
  }

  fs.writeFileSync("notes.json", JSON.stringify(data));
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  let noteId = req.body.noteId;
  let rawData = fs.readFileSync("notes.json");
  let data = JSON.parse(rawData);
  let noteIndex = data.findIndex((note) => note.noteId == noteId);
  data.splice(noteIndex, 1);
  fs.writeFileSync("notes.json", JSON.stringify(data));
  res.redirect("/");
});

app.post("/moveleft", (req, res) => {
  let noteId = req.body.noteId;
  let rawData = fs.readFileSync("notes.json");
  let data = JSON.parse(rawData);
  let noteIndex = data.findIndex((note) => note.noteId == noteId);

  if (noteIndex > 0) {
    // swap notes
    [data[noteIndex - 1], data[noteIndex]] = [data[noteIndex], data[noteIndex - 1]];
    fs.writeFileSync("notes.json", JSON.stringify(data));
  }

  res.redirect("/");
});

app.post("/moveright", (req, res) => {
  let noteId = req.body.noteId;
  let rawData = fs.readFileSync("notes.json");
  let data = JSON.parse(rawData);
  let noteIndex = data.findIndex((note) => note.noteId == noteId);

  if (noteIndex < data.length - 1) {
    // swap notes
    [data[noteIndex], data[noteIndex + 1]] = [data[noteIndex + 1], data[noteIndex]];
    fs.writeFileSync("notes.json", JSON.stringify(data));
  }

  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
