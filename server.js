// index.js

'use strict';
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.get('/', function(req, res) {
// 	res.sendFile(__dirname + '/app/index.html');
// });

// app.get('/css/main.css', function (req, res) {
// 	res.sendFile(__dirname + '/app/css/main.css');
// });

app.use(express.static('app'));

var users = [];

io.on('connection', function(socket) {
	console.log('A user connected.');
	
	socket.on('cMsg', function (nameMsg) {
		var time = new Date();
		var timeString = '' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();

		console.log('message: ' + nameMsg[0] + ': ' + nameMsg[1]);
		io.emit('cMsg', [timeString, nameMsg[0], nameMsg[1]]);
	});

	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
});

http.listen(3000, function() {
	console.log('Server listening on port 3000');
});

// Broadcast a message to connected users when someone connects or disconnects
// Add support for nicknames
// Don’t send the same message to the user that sent it himself. Instead, append the message directly as soon as he presses enter.
// Add “{user} is typing” functionality
// Show who’s online
// Add private messaging
// Share your improvements!