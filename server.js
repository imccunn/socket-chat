'use strict';

const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let users = [];
let userNames = [];
let messageHistory = [];

io.on('connection', function(socket) {
  console.log('A user connected.');
  console.log('socket id: ', socket.id);

  users.push({
    id: socket.id,
    name: 'default',
    socket: socket
  });

  socket.on('name', function(name) {
    let user = users.find((u) => {
      return u.id === socket.id;
    });
    user.name = name;
    userNames.push(name);
    io.emit('updateRoom', userNames);
    const usrJoin = `User ${name} has joined.`;
    io.emit('userJoin', usrJoin);
    console.log('users: ', userNames);
    socket.emit('messageHistory', messageHistory);
  });

  socket.on('cMsg', function (nameMsg) {
    let timeString = getClockTime();

    console.log(`[${(new Date())}] User '${nameMsg[0]}' sent message: '${nameMsg[1]}'`);

    // TODO: Time should be generated on the server but not broadcast to the client. When the
    // client receives the message a time should be generated. [IDM]
    const broadcastMsg = [timeString, nameMsg[0], nameMsg[1]];
    messageHistory.push(broadcastMsg);
    // This sends to all but the sender.
    socket.broadcast.emit('cMsg', broadcastMsg);
  });

  socket.on('typing', function(name) {
    socket.broadcast.emit('userTyping', name);
  });

  socket.on('disconnect', function(socket) {
    console.log('User disconnected.');
    if (!users.findIndex) return;
    let userLeaving = users.findIndex(function(user) {
      return user.socket.disconnected === true;
    });
    console.log('user leaving: ', users[userLeaving].name);
    let userName = users[userLeaving].name;
    userNames.splice(userNames.indexOf(users[userLeaving].name), 1);
    users.splice(userLeaving, 1);
    io.emit('updateRoom', userNames);
    io.emit('userDisconnect', userName);
  });
});

http.listen(3000, function() {
  console.log('Server listening on port 3000');
});

function getClockTime() {
  let time = new Date();
  let s = time.getSeconds();
  s = (s < 10) ? ('0' + s) : s;
  let timeString = '' + time.getHours() + ':' + time.getMinutes() + ':' + s;
  return timeString;
}
// ✓ Broadcast a message to connected users when someone connects or disconnects
// ✓ Add support for nicknames
// ✓ Don’t send the same message to the user that sent it himself. Instead, append the message directly as soon as he presses enter.
// ✓ Add “{user} is typing” functionality
// Show who’s online
// Add private messaging
// Share your improvements!
