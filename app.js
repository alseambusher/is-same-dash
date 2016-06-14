var express = require('express');
var app = express();
var dash = require("./module");
var restore = require("./restore");

var path = require('path');
var mime = require('mime');
var fs = require('fs');
var busboy = require('connect-busboy'); // for file upload


// include the routes
var routes = require("./routes").routes;

// set the view engine to ejs
app.set('view engine', 'ejs');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// include all folders
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/js'));
app.set('views', __dirname + '/views');

//set port
app.set('port', (process.env.PORT || 8000));

app.get(routes.root, function(req, res) {
	// get all the jobs
	dash.jobs(function(){
		res.render('index', {
			routes : JSON.stringify(routes),
		});
	});
})

app.listen(app.get('port'), function() {
  	console.log("dash is running at localhost:" + app.get('port'))
})
