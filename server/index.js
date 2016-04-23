var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var _ = require('lodash');
var uuid = require('node-uuid');

app.use(express.static(__dirname + '/static'));

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Home room should always exist.
var rooms = [{
    uuid: 'home',
    name: 'Home',
    isPublic: false,
    players: [],
    drinking: false,
    turns: 0,
}];
var users = [];

// Handles socket.io connections.
io.on('connection', function(socket) {
    // Set default room and generate temp nick.
    socket.room = 'home';
    socket.join(socket.room);
    socket.nick = 'Guest';
    var i = 1;
    while(_.findIndex(users, { nick: socket.nick }) != -1) {
        i *= 10;
        socket.nick = 'Guest' + Math.ceil(Math.random() * i);
    }
    users.push({
        id: socket.id.substr(2),
        nick: socket.nick
    });
    console.log(socket.nick + ' joined ' + _.find(rooms, { uuid: socket.room}).name);
    
    // The user wants to join a room.
    socket.on('joinRoom', function(uuid) {
        var roomIndex = _.findIndex(rooms, { uuid: uuid });
        if(roomIndex != -1) {
            
            socket.leave(socket.room);
            removeUserFromRoom();
            socket.room = uuid;
            socket.join(socket.room);
            console.log(socket.nick + ' joined ' + _.find(rooms, { uuid: socket.room}).name);
            rooms[roomIndex].players.push(socket.id.substr(2));
            
            if(socket.room != 'home') {
                io.sockets.to(socket.room).emit('userJoined', socket.nick);
            } else if(rooms[roomIndex].isPublic) {
                io.sockets.to('home').emit('playersInRoom', socket.room, rooms[roomIndex].players);
            }
            socket.emit('joinedRoom', rooms[roomIndex]);
        } else {
            socket.emit('noRoom');
        }
    });

    // The user wants to leave room if in one.
    socket.on('leaveRoom', function() {
        socket.leave(socket.room);
        removeUserFromRoom();
        socket.room = 'home';
        socket.join(socket.room);
    });

    // The user wants to join a room, leaves the old room if any.
    socket.on('createRoom', function(name, isPublic, drinking) {
        if(_.findIndex(rooms, { name: name }) == -1 && name && socket.room == 'home') {
            // Create room with a uuid and general game stuff.
            var room = {
                uuid: uuid.v4(),
                name: name,
                isPublic: (isPublic ? true : false),
                players: [socket.id.substr(2)],
                drinking: (drinking ? true : false),
                turns: 0
            }
            rooms.push(room);
            
            socket.leave(socket.room);
            socket.room = room.uuid;
            socket.join(socket.room);
            console.log(socket.nick + ' joined ' + _.find(rooms, { uuid: socket.room}).name);

            if(room.isPublic) {
                io.sockets.to('home').emit('newRoom', {
                    uuid: room.uuid,
                    name: room.name,
                    players: room.players.length,
                    drinking: room.drinking,
                    turns: room.turns
                });
            }
            socket.emit('joinedRoom', room);
        } else {
            socket.emit('roomAlreadyExists');
        } 
    });

    // Tell what rooms that are public
    socket.on('currentRooms', function() {
        var publicRooms = [];
        rooms.forEach(function(room) {
            if(room.isPublic) {
                publicRooms.push({
                    uuid: room.uuid,
                    name: room.name,
                    players: room.players.length,
                    drinking: room.drinking,
                    turns: room.turns
                });
            }
        });
        socket.emit('currentRooms', publicRooms);
    });

    // User wants new nick, checks if available.
    socket.on('setNick', function(nick) {
        var i = 1;
        var old = socket.nick;
        socket.nick = nick;
        while(_.findIndex(users, { nick: socket.nick }) != -1) {
            i *= 10;
            socket.nick = nick + Math.ceil(Math.random() * i);
        }
        _.find(users, { id: socket.id.substr(2) }).nick = socket.nick;
        socket.emit('newNick', socket.nick);
        console.log(old + ' changed nick to ' + socket.nick);
        if(socket.room != 'home') {
            socket.emit('changedNick', { old: old, new: socket.nick });            
        }
    });

    // Request for current nick.
    socket.on('getNick', function() {
        socket.emit('newNick', socket.nick);
    });

    // The user disconnects.
    socket.on('disconnect', function () {
        users.splice(_.findIndex(users, { id: socket.id.substr(2) }), 1);
        removeUserFromRoom();
    });

    // Function to remove user from room
    function removeUserFromRoom() {
        if(socket.room != 'home') {
            io.sockets.to(socket.room).emit('userLeft', socket.nick);
            
            var roomIndex = _.findIndex(rooms, { uuid: socket.room});
            rooms[roomIndex].players.splice(rooms[roomIndex].players.indexOf(socket.id.substr(2)), 1);
            console.log(socket.nick + ' left ' + rooms[roomIndex].name);
            
            if(rooms[roomIndex].players.length == 0) {
                if(rooms[roomIndex].isPublic) {
                    io.sockets.to('home').emit('removeRoom', socket.room);
                }
                console.log('Removed ' + rooms[roomIndex].name + ' because it was empty');
                rooms.splice(roomIndex, 1);
            }
        }
    }
});

