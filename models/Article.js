var mongoose = require("mongoose");

//Reference to Schema construtor
var Schema = mongoose.Schema;

//Using Schema constructor to create a new ArticleSchema object
var ArticleSchema = new Schema({
  //Title must be a string only
  title: {
    type: String,
    required: true
  },
  //link is a url so must be string
  link: {
    type: String,
    required: true
  },
  //summary must be a string only - ONLY ONE SUMMARY IS AVAILABLE, SO ONLY ONE WILL SHOW FOR ALL!!!
  // summary: {
  //   type: String,
  //   required: true
  // },

  // image is a src
  image: {
    type: String,
    required: true
  },

  //note is an object that stores a Note id
  //ref property links to the ObjectId to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

//Export the Article model
module.exports = Article;