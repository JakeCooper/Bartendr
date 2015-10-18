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
            console.log("Sucess");
            res.send("Success");
        }
    });
});

app.get('/api/fb-login', function (req, res) {
    var token = req.query.token;
    res.send();
});

function GetDrink (ingredientList) {
    return ["Jagerbombs"];
}