/**
 * Created by jacobc on 10/17/15.
 */

var app = require('express')(),
    server = require('http').Server(app),
    MongoClient = require('mongodb').MongoClient,
    mongoose = require('mongoose'),
    request = require('request');

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
   fbId : { type : String, default: 'a;klsdfklj;klsdfjas'},
   excludedDrinks : { type : Array, defaults: ["Smirnoff"]},
   triedDrinks :  { type : Array, defaults :  []},
   likedDrinks : { type : Array, defaults : []},
   creationDate : { type : Array, default :  []}
});

var drinkActionSchema = new Schema({
    user : {  type : Schema.ObjectId },
    comment : {type : String, default: ""},
    drink : {type : Schema.ObjectId},
    date : {type : Date, default: Date.now}
});

var drinkActionModel = mongoose.model('drinkactions', drinkActionSchema);

var userModel = mongoose.model('users', userSchema);

function superbag(sup, sub) {
    sup.sort();
    sub.sort();
    var i, j;
    for (i=0,j=0; i<sup.length && j<sub.length;) {
        if (sup[i].toLowerCase() < sub[j].toLowerCase()) {
            ++i;
        } else if (sup[i].toLowerCase() == sub[j].toLowerCase()) {
            ++i; ++j;
        } else {
            // sub[j] not in sup, so sub not subbag
            return false;
        }
    }
    // make sure there are no elements left in sub
    return j == sub.length;
}

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
    var validDrinks = [];

    console.log("GET : Request received with ingredients : " + ingredients);

    drinkModel.find({}, function(err, data) {
      for (var i=0; i < data.length; i++) {
          if (superbag(ingredients, data[i]["ingredients"])) {
            validDrinks.push(data[i]);
          }
      }
      res.send(validDrinks);
    })
});

app.get('/api/after-drink', function (req, res) {
    var drink = req.query.drink;
    console.log("GET : Request received with drink : " + drink);
    var comment = req.query.comment;
    console.log("GET : Response sent with comment : " + comment);
    var tryAgain = req.query.tryAgain;
    console.log("GET : Response sent with tryAgain : " + tryAgain);
    var token = req.query.token;
    console.log("GET : Response sent with token : " + token);
    var user = userModel.findOne('fbId',token);
    var user_id = user._id;

    var drinkAction = new drinkActionModel(
        {
            user: mongoose.Types.ObjectId(user_id),
            comment: comment,
            drink: mongoose.Types.ObjectId(drink)
        }
    );
    drinkAction.save(function(err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("Created drinkAction successfully");
            var bannedDrinks = user.excludedDrinks;

            if (tryAgain === 'false') {
                console.log("here");
                bannedDrinks.append(mongoose.Types.ObjectId(request.body.drink));
                user.excludedDrinks = bannedDrinks;
            }
            userModel.update(
                {
                    _id: user_id,
                }, user, function (err, result) {
                    if (err) {
                        res.send("You fucked up");
                        res.send(err);
                    } else {
                        res.send("OK");
                    }
                });
        }
    });
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
    var uri = "https://graph.facebook.com/v1.0/me\?access_token\=" + token;
    var name = null,
        email = null,
        fbId = null,
        excludedDrinks = ["Smirnoff"],
        triedDrinks = ["Smirnoff"],
        likedDrinks = ["Smirnoff"],
        creationDate = "05-31-1995";

    // make requests to graph API.
    request(uri, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            info = JSON.parse(response.body);
            name = info["name"];
            fbId = info["id"];
            var query = userModel.find({name : name, fbId : fbId});
            query.select("name fbId");
            query.exec(function (err, exists) {
                if (exists === 0) {
                    var user = new userModel({name : name, email : email, fbId: fbId, excludedDrinks : excludedDrinks, triedDrinks : triedDrinks, likedDrinks : likedDrinks, creationDate : creationDate});
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        } else {
                            console.log("Created user successfully");
                            res.send("Created user successfully");
                        }
                    });
                } else {
                    res.send("User already exists");
                }
            });
        }
    });

    //check if the god damn user exists



});