// jshint esversion : 6

const express = require("express");

const bodyParser = require("body-parser");

const https = require("https");

const result = require(__dirname + "/date.js");

const mongoose = require("mongoose");

var _ = require('lodash');

const app = express();

mongoose.connect("mongodb+srv://admin-shantanu:Sheba@5515@cluster0.f9i3o.mongodb.net/TodoListDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema
const todoSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

// Model
const todoModel = mongoose.model("List", todoSchema);

// Insert
const item1 = new todoModel({ name: "Sample" });

const RouteSchema = {
  name : String, 
  documents : [todoSchema]
};

const RouteModel = mongoose.model('Route', RouteSchema);

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// app.listen(process.env.PORT);

// let port = ;
// if (port == null || port == "") {
//   port = 3000;
// }
app.listen(process.env.PORT || 3000, function(){
  console.log("Server has started successfully.");
});

app.get("/", function (req, res) {
  todoModel.find({}, function (err, result) {
    if (result.length === 0) {
      todoModel.insertMany([item1], function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("All Okay!");
        }
      });
      res.redirect("/");
    } else {
      res.render("lists", { listTitle: "Today", listItems: result });
    }
  });
});

app.post("/", function (req, res) {
  const input = req.body.input;
  const route = req.body.submit;
  console.log(input);
  const newItem = new todoModel({ name: input });

  if(route === "Today"){

    newItem.save();
    res.redirect("/");

  }else{

    RouteModel.findOne({name : route}, function(err, result){
      if(!err){
        result.documents.push(newItem);
        result.save(); 
        res.redirect("/"+route);
      }
    });

  }
  
  // if (req.body.submit === "Work") {
  //   workItems.push(req.body.input);
  //   res.redirect("/work");
  // } else {
  //   items.push(req.body.input);
  //   res.redirect("/");
  // }
});

app.get("/work", function (req, res) {
  res.render("lists", { listTitle: "Work List", listItems: workItems });
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(_.lowerCase(req.params.customListName));
  

  RouteModel.find({name: customListName}, function(err, result){
    if(err){
      console.log(err);
    }else{
      if(result.length ===0){

        const routItem  = new RouteModel({
          name : customListName,
          documents : [item1]
        });
        routItem.save();
        res.redirect("/"+ customListName);
      }
      result.forEach(function(element){
        if (element.name === customListName){
          res.render("lists", { listTitle: customListName, listItems: element.documents});
        }
      });
    }
  });
});


app.get("/about", function (req, res) {
  res.render("about");
});

app.post("/delete", function (req, res) {
  const itemId = req.body.checkbox;
  console.log("Item ID =" + itemId);
  const listName = req.body.listName;

  if (listName === 'Today'){
        todoModel.findByIdAndDelete(itemId, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Item Deleted Successfully.");
      res.redirect('/');
    }
  });
  }else{
    
    RouteModel.findOneAndUpdate({name : listName},{$pull :{ documents : {_id : itemId}}}, function(err, foundList){
      if(!err){
        res.redirect('/'+listName);
      }
    });

  }


  
  

});


