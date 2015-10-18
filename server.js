/**
 * Created by jacobc on 10/17/15.
 */

var app = require('express')(),
    server = require('http').Server(app);

server.listen(8080, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Bartendr webserver launched at http://%s:%s', host, port);
});

app.get('/', function(req, res) {
   res.send("Welcome to Bartendr");
});

app.get('/api/', function (req, res) {
    var ingredients = req.query.ingredient;
    console.log("GET : Request received with ingredients : " + ingredients);
    var drinks = DoSearch();
    console.log("POST : Response sent with drinks : " + drinks);
    res.send(drinks);
});

function DoSearch (ingredientList) {
    return ["Jagerbombs"];
}