var app = require('express').createServer();
var io  = require('socket.io').listen(app);
var client_id = 0;
var port = process.env.PORT || 5000;
app.listen(port);

app.get('/', handleExpress);
io.sockets.on('connection', handleSocketConnect);

function handleExpress(req, res)
{
	//console.log('req: '+ req);
	//console.log('res: ' + res);
	res.sendfile(__dirname + '/html/index.html');
}

function handleSocketConnect(socket)
{
	console.log('socket conectado');
	socket.set('client_id', client_id, function(){});
	socket.volatile.emit('onConnect', {id: client_id++});

	// Escuchar
	socket.on('update', handleUpdate);
	socket.on('disconnect', handleDisconnect);
}

function handleUpdate(data)
{
	// data debe de tener
	// {id, nombre, point{} }
	var socket = this;
	//io.sockets.emit('onUpdate', data);
	io.sockets.volatile.emit('onUpdate', data);
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
	
	io.sockets.volatile.emit('clientDisconnected',
		{
			id: _client_id
		});
}