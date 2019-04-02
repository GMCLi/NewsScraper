var mongoose = require("mongoose");

//Save reference to the Schema constructor
var Schema = mongoose.Schema;

//Use the schema constructor to create a new NoteSchema object
var NoteSchema = new Schema({
  //title is only a string
  title: String,
  //body is only a string
  body: String
});

var Note = mongoose.model("Note", NoteSchema);

//Export
module.exports = Note;