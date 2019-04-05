//Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 5000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/NewsDatabase";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

// A GET route for scraping CBC
app.get("/cbcscrape", function (req, res) {
  //Grab body of html using axios and putting it into the response
  axios.get("http://www.cbc.ca/").then(function (response) {
    //Use cheerio to save response.data as $ to use as a shorthand selector
    var $ = cheerio.load(response.data);

    //Look for every h3-tag with the class "headline" and save in an empty result object
    $("a.card").each(function (i, element) {
      var result = {};

      // Save the text of the h4-tag as result.title
      result.title = $(element).text();

      // Find the href and save it's href value as result.link
      result.link = "http://www.cbc.ca" + $(element).attr("href");
      // console.log(result.link)
      //ERROR ONLY ONE SUMMARY IS AVAILABLE, SO ONLY ONE WILL SHOW FOR ALL!!!
      //Find the summary and save it's value as result.summary
      // result.summary = $(".card-content .description").text();

      //Find the img and save it's src as result.image
      result.image = $("img", element).attr("src");
      // console.log("IMAGE.............................................."+result.image);

      //Creating a new Article with the 'result' object from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          //Verify dbArticle by console log
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
    //Send a message to verify completion of scrape
    res.send("CBC Website Scrape Completed");
  });
});


// A GET route for scraping NationalNewsWatch
app.get("/NNWscrape", function (req, res) {
  //Grab body of html using axios and putting it into the response
  axios.get("http://www.nationalnewswatch.ca/").then(function (response) {
    //Use cheerio to save response.data as $ to use as a shorthand selector
    var $ = cheerio.load(response.data);

    //Look for every h3-tag with the class "headline" and save in an empty result object
    $(".title").each(function (i, element) {
      var result = {};

      // Save the text of the h4-tag as result.title
      result.title = $(element).children().text();

      // Find the href and save it's href value as result.link
      result.link = $(element).children().attr("href");

      //ERROR ONLY ONE SUMMARY IS AVAILABLE, SO ONLY ONE WILL SHOW FOR ALL!!!
      //Find the summary and save it's value as result.summary
      // result.summary = $(".card-content .description").text();

      //Find the img and save it's src as result.image
      result.image = $(element).parent().parent().first().first().children().children().children().attr("src");
      // console.log("NNW IMAGE ........" + result.image)

      //Creating a new Article with the 'result' object from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          //Verify dbArticle by console log
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
    //Send a message to verify completion of scrape
    res.send("National News Watch Website Scrape Completed");
  });
});



//Routes
//Route for grabbing all articles from database
app.get("/articles", function (req, res) {
  //Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      //If successful in finding the Articles, send them back to client
      res.json(dbArticle);
    })
    .catch(function (err) {
      //In case of error
      res.json(err);
    });
});

//Route for grabbing an Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  //Use req.params.id with the query
  db.Article.findOne({ _id: req.params.id })
    // ..populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      //If successful, find the Article with the id and send to client
      res.json(dbArticle);
    })
    .catch(function (err) {
      //In case of error
      res.json(err);
    });
});

//Route for saving/updating Article's note
app.post("/articles/:id", function (req, res) {
  //Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      //If note created successfully, find the Article with the right id based on req.params.id. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      //mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      //If Article successfully updated, send to client
      res.json(dbArticle);
    })
    .catch(function(err) {
      //In case of error
      res.jsons(err);
    });
});

//Route for deleting all articles
app.delete("/articles/", function (req, res) {
  db.Article.deleteMany({},function(err) {
    if (err) return (err);
    
  })

})

//Start server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});