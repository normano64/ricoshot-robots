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
var emptyRooms = [];

io.use(function(socket, next){
    var nick = decodeURIComponent(socket.handshake.query.nick);
    if(nick && nick.length < 32) {
        socket.nick = nick;
    } else {
        socket.nick = 'Guest';
        nick = 'Guest';
    }
    var i = 1;
    while(_.findIndex(users, { nick: socket.nick }) != -1) {
        i *= 10;
        socket.nick = nick + Math.ceil(Math.random() * i);
    }
    users.push({
        id: socket.id.substr(2),
        nick: socket.nick
    });
    return next();
});

// Handles socket.io connections.
io.on('connection', function(socket) {
    // Set default room and generate temp nick.
    socket.room = 'home';
    socket.join(socket.room);
    socket.emit('newNick', socket.nick);
    console.log(socket.nick + ' joined ' + _.find(rooms, { uuid: socket.room}).name);
    
    // The user wants to join a room.
    socket.on('joinRoom', function(uuid) {
        if(uuid != socket.room) {
            var roomIndex = _.findIndex(rooms, { uuid: uuid });
            if(roomIndex != -1) {

                var oldRoomName = _.find(rooms, { uuid: socket.room }).name;
                socket.leave(socket.room);
                removeUserFromRoom();
                socket.room = uuid;
                socket.join(socket.room);
                console.log(socket.nick + ' left ' + oldRoomName  + ' and joined ' + rooms[roomIndex].name);
                rooms[roomIndex].players.push(socket.id.substr(2));

                if(socket.room != 'home') {
                    io.sockets.to(socket.room).emit('userJoined', socket.nick);
                }
                if(rooms[roomIndex].isPublic) {
                    io.sockets.to('home').emit('playersInRoom', socket.room, rooms[roomIndex].players.length);
                }
                socket.emit('joinedRoom', rooms[roomIndex]);
            } else {
                socket.emit('goRoom', 'home');
            }
        }
    });

    // The user wants to leave room if in one.
    socket.on('leaveRoom', function() {
        var oldRoomName = _.find(rooms, { uuid: socket.room }).name;
        socket.leave(socket.room);
        removeUserFromRoom();
        socket.room = 'home';
        socket.join(socket.room);
        console.log(socket.nick + ' left ' + oldRoomName  + ' and joined ' + _.find(rooms, { uuid: socket.room }).name);
    });

    // The user wants to leave room if in one.
    socket.on('goRoom', function(uuid) {
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
                players: [],
                drinking: (drinking ? true : false),
                turns: 0
            }
            rooms.push(room);
            console.log(socket.nick + ' created ' + room.name);

            if(room.isPublic) {
                io.sockets.to('home').emit('newRoom', {
                    uuid: room.uuid,
                    name: room.name,
                    players: room.players.length,
                    drinking: room.drinking,
                    turns: room.turns
                });
            }
            socket.emit('goRoom', room.uuid);
        } else {
            socket.emit('roomAlreadyExists');
        } 
    });

    // Tell what rooms that are public.
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
        if(nick && nick.length < 32) {
            var i = 1;
            var oldNick = socket.nick;
            socket.nick = nick;
            while(_.findIndex(users, { nick: socket.nick }) != -1) {
                i *= 10;
                socket.nick = nick + Math.ceil(Math.random() * i);
            }
            _.find(users, { id: socket.id.substr(2) }).nick = socket.nick;
            socket.emit('newNick', socket.nick);
            console.log(oldNick + ' changed nick to ' + socket.nick);
            if(socket.room != 'home') {
                socket.emit('changedNick', { old: oldNick, new: socket.nick });
            }
        }
    });

    // Request for current nick.
    socket.on('getNick', function() {
        socket.emit('newNick', socket.nick);
    });

    // Broadcast chat message to all users in the same room.
    socket.on('chatMessage', function(message) {
        if(socket.room != 'home') {
            io.sockets.to(socket.room).emit('chatMessage', socket.nick, message, (new Date()).getTime());
        }
    });


    // User asks to join a room.
    socket.on('joinRoom', function(uuid) {
        if(uuid != socket.room) {
            var roomIndex = _.findIndex(rooms, { uuid: uuid });
            if(roomIndex != -1) {

                var oldRoomName = _.find(rooms, { uuid: socket.room }).name;
                socket.leave(socket.room);
                removeUserFromRoom();
                socket.room = uuid;
                socket.join(socket.room);
                console.log(socket.nick + ' left ' + oldRoomName  + ' and joined ' + rooms[roomIndex].name);
                rooms[roomIndex].players.push(socket.id.substr(2));

                if(socket.room != 'home') {
                    io.sockets.to(socket.room).emit('userJoined', socket.nick);
                }
                if(rooms[roomIndex].isPublic) {
                    io.sockets.to('home').emit('playersInRoom', socket.room, rooms[roomIndex].players.length);
                }
                socket.emit('joinedRoom', rooms[roomIndex]);
            } else {
                socket.emit('goRoom', 'home');
            }
        }
    });

    // The user disconnects.
    socket.on('disconnect', function () {
        users.splice(_.findIndex(users, { id: socket.id.substr(2) }), 1);
        console.log(socket.nick + ' left ' + _.find(rooms, { uuid: socket.room }).name);
        removeUserFromRoom();
    });

    // Function to remove user from room.
    function removeUserFromRoom() {
        if(socket.room != 'home') {
            io.sockets.to(socket.room).emit('userLeft', socket.nick);
            
            var roomIndex = _.findIndex(rooms, { uuid: socket.room});
            rooms[roomIndex].players.splice(rooms[roomIndex].players.indexOf(socket.id.substr(2)), 1);
            io.sockets.to('home').emit('playersInRoom', socket.room, rooms[roomIndex].players.length);
            
            if(rooms[roomIndex].players.length == 0) {
                emptyRooms.push({
                    uuid: socket.room,
                    added: (new Date()).getTime()
                });
            }
        }
    }
});

// Remove empty rooms older than 1 minute.
function cleanEmptyRooms() {
    var pastTime = (new Date()).getTime() - 60000;
    var currentEmptyRooms = emptyRooms;
    emptyRooms = [];

    currentEmptyRooms.forEach(function(room) {
        var roomIndex = _.findIndex(rooms, { uuid: room.uuid});
        if(rooms[roomIndex].players.length == 0) {
            if(room.added < pastTime) {
                if(rooms[roomIndex].isPublic) {
                    io.sockets.to('home').emit('removeRoom', room.uuid);
                }
                console.log('Removed ' + rooms[roomIndex].name + ' because it was empty');
                rooms.splice(roomIndex, 1);
            } else {
                emptyRooms.push(room);
            }
        }
    });
}

// 1 minute interval for cleaning.
var timer = setInterval(cleanEmptyRooms, 60000);
