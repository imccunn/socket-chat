// index.js

'use strict';
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.get('/', function(req, res) {
//  res.sendFile(__dirname + '/app/index.html');
// });

app.use(express.static('public'));

var users = [];

io.on('connection', function(socket) {
  console.log('A user connected.');
  // Track users by socket
  users.push(socket);
  
  socket.on('cMsg', function (nameMsg) {
    var time = new Date();
    var timeString = '' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();

    console.log('message: ' + nameMsg[0] + ': ' + nameMsg[1]);
    io.emit('cMsg', [timeString, nameMsg[0], nameMsg[1]]);
  });
  
  socket.on('typing', function(status) { // TODO: broadcast when user is typing
    io.emit('userTyping', status);
  });   
  socket.on('disconnect', function(socket) {
    console.log('User disconnected.');
    var i = users.indexOf(socket);
    users.splice(i, 1);
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
