//jshint esversion:6

const express = require("express");

const bodyParser = require("body-parser");

const ejs = require("ejs");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

const _ = require('lodash');

const mongoose = require('mongoose');

// Establish connection
mongoose.connect('mongodb+srv://admin-shantanu:Sheba@5515@cluster0.f9i3o.mongodb.net/BlogPost', {useNewUrlParser: true, useUnifiedTopology : true});

// Build Schema 
const blogSchema =  new mongoose.Schema({
  title : String, 
  body : String
});

// Build Model for that Schema 
const blogModel = mongoose.model('post', blogSchema);

// // insert 
// const sample = new blogModel({title : 'Sample', body : 'Sample Body'});

// sample.save();

let array = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(process.env.PORT ||3000, function () {
  console.log("Server started on port 3000");
});

app.get("/", function (req, res) {
  let array; 
  blogModel.find({}, function(err, result){
    if (!err){
      if (result.length === 0){
        res.redirect('/');
      }else{
        array = result;
        res.render("home", { homeContent: homeStartingContent, nums: array });
      }
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutC: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactC: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const obj = new blogModel({
    title: req.body.title,
    body: req.body.postBody,
  });
  obj.save();
  res.redirect("/");
});

app.get("/posts/:item", function (req, res) {
  // const input = _.lowerCase(_.join((_.split(req.params.item))));
  const input = req.params.item;
  console.log("input = "+input);
  blogModel.findById(input, function(err, result){
    if ((!err) && result != 'lodash.js'){
      console.log(result.title);
      console.log(result.body);
      res.render('post', {title : result.title, body : result.body});
    }else{
      res.redirect('/');
    }
  });

  // console.log(input);
  // let flag = false;
  // array.forEach(function (element) {
  //   const ele = _.lowerCase(element.content);
  //   if (ele === input) {
  //     flag = true;
  //     res.render("post", { title: element.content, body: element.postBody });
  //   }
  // });
  // if (flag === false) {
  //   res.redirect("/");
  // }
});
