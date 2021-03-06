/*********** MessageBox ****************/
// simply show info.  Only close button
function infoMessageBox(message, title){
	$("#info-body").html(message);
	$("#info-title").html(title);
	$("#info-popup").modal('show');
}
// modal with full control
function messageBox(body, title, ok_text, close_text, callback){
	$("#modal-body").html(body);
	$("#modal-title").html(title);
	if (ok_text) $("#modal-button").html(ok_text);
	if(close_text) $("#modal-close-button").html(close_text);
	$("#modal-button").unbind("click"); // remove existing events attached to this
	$("#modal-button").click(callback);
	$("#popup").modal("show");
}

/*********** dash actions ****************/

function setCrontab(){
	messageBox("<p> Do you want to set the crontab file? </p>", "Confirm crontab setup", null, null, function(){
		$.get(routes.crontab, { "env_vars": $("#env_vars").val() }, function(){
			// TODO show only if success
			infoMessageBox("Successfuly set crontab file!","Information");
		});
	});
}
// This is stored in main memory of user
// TODO destroy corresponding diff when tile is closed
var diffs = {};

// Tile
function runTile(id){
	var urls = getTileUrls(id);
	var server_paths = getTileServerPaths(id);
	$("#"+id+" .loader").removeAttr("style");
	$.post(routes.run_tile, {urls: urls}, function(data){

		diffs[id] = data.diff;

		var resultTile = "<div id='"+id+"-results-same'></div>";
		resultTile += "<div id='"+id+"-diff-control'></div>";
		$("#"+id+"-results").html(resultTile);

		console.log(data);

		var options = "";
		for(var i=0; i<server_paths.length; i++){
			options += "<option value='"+i+"'>"+server_paths[i][0]+"</option>"
		}

		var grouped = {}
		for (var i=0; i<data.sha.length; i++){
				if (grouped[data.sha[i]])
					grouped[data.sha[i]].push(urls[i])
				else
					grouped[data.sha[i]] = [urls[i]]
		}
		for (var sha in grouped) {
			$("#"+id+"-results-same").append("<div class='alert alert-success' style='margin-bottom: 0px'>"+grouped[sha].join("<br/>")+"</div>");
		}

		$("#"+id+"-diff-control").append("<select class='form-control' onchange='diffTile(\""+id+"\")'>"+options+"</select>");
		$("#"+id+"-diff-control").append("<select class='form-control' onchange='diffTile(\""+id+"\")'>"+options+"</select>");
		$("#"+id+"-results").append("<pre class='alert alert-danger' id='"+id+"-diff-result' style='display:none'></div");

		$("#"+id+" .loader").attr("style", "display:none");
	}).error(function() {
		$("#"+id+" .loader").attr("style", "display:none");
	});
}

function diffTile(id){
	var options = $("#"+id+"-diff-control select");
	var x = parseInt(options[0].value);
	var y = parseInt(options[1].value);
	var total = options[0].length;
	console.log(y*total + x);
	$("#"+id+"-diff-result").html(diffs[id][y*total + x]);
	$("#"+id+"-diff-result").removeAttr("style");
}

function newTile(){
	var id = Math.random().toString(36).slice(2);
	var tile = "<div class='alert alert-info alert-dismissible' role='alert' id='"+id+"'>\
  	<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>\
		<a class='btn btn-default' onclick='runTile(\""+id+"\");'>\
			<span class='glyphicon glyphicon-play' aria-hidden='true'></span>\
		</a>\
		<a class='btn btn-default' onclick='newServerPathContainer(\""+id+"\");'>\
			<span class='glyphicon glyphicon-plus' aria-hidden='true'></span>\
		</a>\
		<a class='btn btn-default'>\
			<span class='glyphicon glyphicon-time' aria-hidden='true'></span>\
		</a>\
		<a class='btn btn-default'>\
			<span class='glyphicon glyphicon-floppy-disk' aria-hidden='true'></span>\
		</a>\
		<a class='btn btn-default'>\
			<span class='glyphicon glyphicon-trash' aria-hidden='true'></span>\
		</a>\
  	<br/><br/> \
		<div id='"+id+"-container'></div><br/>\
		<div class='loader' style='display:none'>Loading...</div>\
		<div id='"+id+"-results'></div>\
	</div>";
	$(".tiles").prepend(tile);
	return id;
}

//ServerUrlContainer
function newServerPathContainer(id){
	var _id = Math.random().toString(36).slice(2);
	var tile = "<div class='input-group' id='"+_id+"'>\
      <div class='input-group-btn'>\
        <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Server <span class='caret'></span></button>\
        <ul class='dropdown-menu'>";
	for(var i=0; i<servers.length; i++){
		tile += "<li onclick='$(\"#"+_id+"-server\").html(\""+servers[i]+"\")'><a href='#'>"+servers[i]+"</a></li>";
	}

	var value = $("#"+id+"-container .form-control").last().val();

	tile += "<li role='separator' class='divider'></li>\
          <li><a href='#'>Add new</a></li>\
        </ul>\
		<a class='btn btn-default' onclick='$(\"#"+_id+"\").remove()'>\
			<span class='glyphicon glyphicon-trash' aria-hidden='true'></span>\
		</a>\
      </div><!-- /btn-group -->\
			<span class='input-group-addon' id='"+_id+"-server'>https://</span>\
      <input type='text' class='form-control' id='"+_id+"-path' value='"+(value==undefined ? "" : value)+"'>\
    </div><!-- /input-group -->";

	$("#"+id+"-container").append(tile);
}

function getTileServerPaths(id){
	var path_nodes = $("#"+id+"-container .form-control");
	var server_nodes = $("#"+id+"-container .input-group-addon");
	var result = [];
	for(var i=0; i<path_nodes.length; i++){
		result.push([server_nodes[i].innerHTML, path_nodes[i].value]);
	}
	return result;
}

function getTileUrls(id){
	var path_nodes = $("#"+id+"-container .form-control");
	var server_nodes = $("#"+id+"-container .input-group-addon");
	var result = [];
	for(var i=0; i<path_nodes.length; i++){
		result.push(server_nodes[i].innerHTML+path_nodes[i].value);
	}
	return result;
}
