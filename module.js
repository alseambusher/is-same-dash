//load database
var Datastore = require('nedb');
var db = new Datastore({ filename: __dirname + '/boards/dash.db' });
db.loadDatabase(function (err) {
});
var exec = require('child_process').exec;
var fs = require('fs');
var os = require("os")

dash = function(){
	var data = {};
	return data;
}

exports.jobs= function(callback){
	callback();
}
