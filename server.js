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
    instructions : {type: Array, default: []},
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
    var ingredients = req.query.ingredient;
    console.log("GET : Request received with ingredients : " + ingredients);
    var drinks = GetDrink(ingredients);
    console.log("POST : Response sent with drinks : " + drinks);
    res.send(drinks);
});

app.get('/api/add-drink', function (req, res) {
    var params = JSON.stringify(req.query);
    if (params["name"] == undefined) {
        res.send("Invalid name");
        return
    } else if (params["ingredients"] == undefined) {
        res.send("Invalid ingredients");
        return
    } else if (params["instructions"] == undefined) {
        res.send("Invalid instructions");
        return
    } else if (params["comments"] == undefined) {
        params["comments"] = "";
    }
    var drink = new drinkModel({name: params["name"], ingredients: params["ingredients"], instructions: params["instructions"], comments:params["comments"]});
    console.log("drink: " + test);

    drink.save(function (err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send("Success");
        }
    });
});

function GetDrink (ingredientList) {
    return ["Jagerbombs"];
}