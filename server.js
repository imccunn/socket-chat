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
var userNames = [];

io.on('connection', function(socket) {
  console.log('A user connected.');
  // Track users by socket
  users.push({
    id: socket.id,
    name: 'default',
    socket: socket
  });
  console.log('socket id: ', socket.id);
  
  socket.on('name', function(name) {
    users[findWithAttr(users, 'id', socket.id)].name = name;
    userNames.push(name);
    io.emit('updateRoom', userNames);
    io.emit('userJoin', name);
    console.log('users: ', userNames);
  }); 
  socket.on('cMsg', function (nameMsg) {
    var time = new Date();
    var timeString = '' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();

    console.log('message: ' + nameMsg[0] + ': ' + nameMsg[1]);
    // This sends to all but the sender.
    socket.broadcast.emit('cMsg', [timeString, nameMsg[0], nameMsg[1]]);
  });
  
  socket.on('typing', function(name) { // TODO: broadcast when user is typing
    io.emit('userTyping', name);
  });

  socket.on('disconnect', function(socket) {
    console.log('User disconnected.');
    var userLeaving = users.findIndex(function(user) {
      return user.socket.disconnected === true;
    });
    console.log('user leaving: ', users[userLeaving].name);
    var userName = users[userLeaving].name;
    userNames.splice(userNames.indexOf(users[userLeaving].name), 1);
    users.splice(userLeaving, 1);
    io.emit('updateRoom', userNames);
    io.emit('userDisconnect', userName);
  });
});

http.listen(3000, function() {
  console.log('Server listening on port 3000');
});


function findWithAttr(arr, attr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][attr] === val) {
      return i;
    }
  }
  return -1;
}
// ✓ Broadcast a message to connected users when someone connects or disconnects 
// ✓ Add support for nicknames
// ✓ Don’t send the same message to the user that sent it himself. Instead, append the message directly as soon as he presses enter.
// ✓ Add “{user} is typing” functionality
// Show who’s online
// Add private messaging
// Share your improvements!
