/**
 * Created by jacobc on 10/17/15.
 */

var app = require('express')(),
    server = require('http').Server(app),
    MongoClient = require('mongodb').MongoClient,
    mongoose = require('mongoose');

var uri = "mongodb://admin:admin@ds041144.mongolab.com:41144/bartendr";
var db = mongoose.connect(uri);
var Schema = mongoose.Schema;

var drinkSchema = new Schema({
    name  :  { type: String, default: '' },
    ingredients   :  { type: Array, default: [] },
    instructions : {type: String, default: ""},
    comments : {type: String, default: ''}
});

var drinkModel = mongoose.model('drinks', drinkSchema);

var userSchema = new Schema({
   name : { type: String, default: 'Joe'},
   email : { type: String, default: 'JoeSmith@Gmail.com'} ,
   fbToken : { type : String, default: 'a;klsdfklj;klsdfjas'},
   excludedDrinks : { type : Array, defaults: ["Smirnoff"]},
   triedDrinks :  { type : Array, defaults :  []},
   likedDrinks : { type : Array, defaults : []},
   creationDate : { type : Array, default :  []}
});

var userModel = mongoose.model('users', userSchema);

server.listen(process.env.PORT, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Bartendr webserver launched at http://%s:%s', host, port);
});

app.get('/', function(req, res) {
   res.send("Welcome to Bartendr");
});

app.get('/api/get-drink', function (req, res) {
    var ingredients = req.query.ingredients;
    console.log("GET : Request received with ingredients : " + ingredients);
    var drinks = GetDrink(ingredients);
    console.log("GET : Response sent with drinks : " + drinks);
    res.send(drinks);
});

app.get('/api/add-drink', function (req, res) {
    console.log("GET : Request received to add drink with properties : " + req.query);
    var name = unescape(req.query.name),
        ingredients = unescape(req.query.ingredients),
        instructions = unescape(req.query.instructions),
        comments = unescape(req.query.comments);

    var drink = new drinkModel({name: name, ingredients: ingredients, instructions: instructions, comments: comments});
    console.log("drink summary: " + drink);

    drink.save(function (err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("Created drink successfully");
            res.send("Created drink successfully");
        }
    });
});

app.get('/api/fb-login', function (req, res) {
    var token = req.query.token;
    //make requests to graph API.
    //check if the god damn user exists


    var name = "Joe Smith",
        email = "Joe@Smith.com",
        fbToken = "ajlskdfja",
        excludedDrinks = "Smirnoff",
        triedDrinks = "Smirnoff",
        likedDrinks = "Smirnoff",
        creationDate = "05-31-1995";

    var user = new userModel({name : name, email : email, fbToken: fbToken, excludedDrinks : excludedDrinks, triedDrinks : triedDrinks, likedDrinks : likedDrinks, creationDate : creationDate});
    user.save(function (err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("Created user successfully");
            res.send("Created user successfully");
        }
    });
});

function GetDrink (ingredientList) {
    //drink - inventory = empty set.
    var drink = new drinkModel({});
    return ["Jagerbombs"];
}