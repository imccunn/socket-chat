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
var messageHistory = [];

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
    var usrJoin = 'User ' + name + ' has joined.';
    io.emit('userJoin', usrJoin);
    console.log('users: ', userNames);
    socket.emit('messageHistory', messageHistory);
  });

  socket.on('cMsg', function (nameMsg) {
    var timeString = getClockTime();

    console.log('message: ' + nameMsg[0] + ': ' + nameMsg[1]);
    var broadcastMsg = [timeString, nameMsg[0], nameMsg[1]];
    messageHistory.push(broadcastMsg);
    // This sends to all but the sender.
    socket.broadcast.emit('cMsg', broadcastMsg);
  });

  socket.on('typing', function(name) { // TODO: broadcast when user is typing
    socket.broadcast.emit('userTyping', name);
  });

  socket.on('disconnect', function(socket) {
    console.log('User disconnected.');
    if (!users.findIndex) return;
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

function getClockTime() {
  var time = new Date();
  var s = time.getSeconds();
  s = (s < 10) ? ('0' + s) : s;
  var timeString = '' + time.getHours() + ':' + time.getMinutes() + ':' + s;
  return timeString;
}
// ✓ Broadcast a message to connected users when someone connects or disconnects
// ✓ Add support for nicknames
// ✓ Don’t send the same message to the user that sent it himself. Instead, append the message directly as soon as he presses enter.
// ✓ Add “{user} is typing” functionality
// Show who’s online
// Add private messaging
// Share your improvements!
