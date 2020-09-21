//jshint esversion:6

const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

// connect to the database;
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = {
    email: String, 
    password : String
};

const userModel = new mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({
    extended : true
}));


app.listen(3000, function(){
    console.log('Running on Port 3000!');
});

app.get('/', function(req, res){
    res.render('home');
});

app.get('/register', function(req, res){
    res.render('register');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/register', function(req, res){
    const user1 = new userModel({
        email : req.body.username,
        password : req.body.password
    });

    user1.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render('secrets');
        }
    });
});

app.post('/login', function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    userModel.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if (foundUser.password === password){
                res.render('secrets');
            }
        }
    });
});