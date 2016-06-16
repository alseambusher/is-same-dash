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

// Tile
function runTile(id){
		console.log(id);
		$.post(routes.run_tile, { urls: ['https://author.stage.corp.adobe.com/content/dotcom/en/technology.html', 'https://author.stage.corp.adobe.com/content/dotcom/en/technology.html']}, function(data){
			console.log(data);
		});
}

function newTile(){
	var id = Math.random().toString(36).slice(2);
	var tile = "<div class='alert alert-info alert-dismissible' role='alert' id='"+id+"'>\
  	<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>\
		<a class='btn btn-default' onclick='runTile(\""+id+"\");'>\
			<span class='glyphicon glyphicon-play' aria-hidden='true'></span>\
		</a>\
		<a class='btn btn-default' onclick='newServerUrlContainer(\""+id+"\");'>\
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
		<div id='"+id+"-container'></div>\
	</div>";
	$(".tiles").prepend(tile);
	return id;
}

//ServerUrlContainer
function newServerUrlContainer(id){
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
      <input type='text' class='form-control' id='"+_id+"-path' value='"+(value==undefined? "": value)+"'>\
    </div><!-- /input-group -->";
	$("#"+id+"-container").append(tile);
}

function getTileServerUrls(id){
	//TODO
}
