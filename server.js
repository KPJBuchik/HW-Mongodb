


var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3001;

var app = express();

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/mongoscraper", { useNewUrlParser: true });
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);





app.get("/saved", function(req, res) {
    res.render("saved");
});

app.get("/", function (req, res) {
    res.render("index");

  axios.get("http://www.theonion.com/").then(function (response) {
    var $ = cheerio.load(response.data);

    $("section").each(function (i, element) {
      var result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle)
    })
    .catch(function (err) {
      res.json(err)
    })
});

app.get("/articles/:id", function(req, res) {

    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {

        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
  app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {

        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  


app.delete("/articles", function (req,res){
db.Article.remove({})
.then(function(dbArticle){
    res.json(dbArticle)
})
})

app.delete("/articles/:id", function (req,res){
    db.Article.remove({_id: req.params.id})
    .then(function(dbArticle){
        res.json(dbArticle)
    })
    })
app.patch("/articles/:id", function(req, res) {
db.Article.updateOne({_id: req.params.id})
.then(function (dbArticle){
    res.json(dbArticle)
})
})
app.get("/articles/:id", function(req,res){
db.Note.find({_id: req.params.id})
.then(function(dbArticle){
    res.json(dbArticle)
})

})


// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});


