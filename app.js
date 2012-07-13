/*
	Simple mouse tracker
	Author: Rolf Ruiz
		alesys.net
		r@alesys.net
		@alesys_net
	July 13, 2012
*/


var app = require('express').createServer();
var io  = require('socket.io').listen(app);
var client_id = 0;
var port = process.env.PORT || 5000;
app.listen(port);

app.get('/', handleExpress);
io.sockets.on('connection', handleSocketConnect);

function handleExpress(req, res)
{
	res.sendfile(__dirname + '/html/index.html');
}

function handleSocketConnect(socket)
{
	console.log('new connection');
	socket.set('client_id', client_id, function(){});
	socket.emit('onConnect', {id: client_id++});	
	socket.on('update', handleUpdate);
	socket.on('disconnect', handleDisconnect);
}

function handleUpdate(data)
{
	var socket = this;	
	io.sockets.emit('onUpdate', data);
}

function handleDisconnect()
{
	console.log('socket desconectado');
	var socket = this;
	var _client_id;
	socket.get('client_id',function(err, name){
		_client_id = name;
		console.log(name);
	});
	console.log('client_id:'+_client_id);
	
	io.sockets.emit('clientDisconnected',
		{
			id: _client_id
		});
}