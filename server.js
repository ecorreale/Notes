var express = require("express");
var fs = require("fs");
var path = require("path");

var notesArr = [];
var app = express();

var PORT = process.env.PORT || 3000;

// Note ID Indexer
var _NoteIDX = 0;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    fs.readFile(__dirname + "/db/db.json", function(err, data) {
        notesArr = JSON.parse(data);

        res.json(notesArr);
    });
});

// Add a Note
app.post("/api/notes", (req, res) => {
    var newNote = req.body;
    newNote.id = ++_NoteIDX;
    notesArr.push(newNote);

    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notesArr), function(err) {
        res.json(newNote);
    });


});

app.delete("/api/notes/:id", (req, res) => {
    id = req.params.id;
    id--;

    notesArr.splice(id, 1);
    // console.log(notesArr);
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notesArr), function(err) {});
});



app.listen(PORT, function() {

    fs.readFile(__dirname + "/db/db.json", function(err, data) {
        notesArr = JSON.parse(data);

        //Add numeric ID to each note element
        notesArr.forEach(note => {
            note.id = ++_NoteIDX;
        });
        console.log(notesArr);
        console.log("Server Listening");
    });

});