var express = require('express');
var app = express();
var dash = require("./module");
var restore = require("./restore");

var path = require('path');
var mime = require('mime');
var fs = require('fs');
var busboy = require('connect-busboy'); // for file upload
var child_process= require("child_process");
var servers = require("./servers");

// include the routes
var routes = require("./routes").routes;

// set the view engine to ejs
app.set('view engine', 'ejs');

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
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
      servers : JSON.stringify(servers.servers),
		});
	});
})

app.post(routes.run_tile, function(req, res){
  child_process.execFile("scripts/fetch.sh", req.body.urls, function (error, stdout, stderr){
    result = stdout.split("\n");
    separator = result[req.body.urls.length]
    res.json({ sha: result.slice(0, req.body.urls.length), diff: result.slice(req.body.urls.length+1).join("\n").split(separator)});
  });
})

app.listen(app.get('port'), function() {
  	console.log("dash is running at localhost:" + app.get('port'))
})
