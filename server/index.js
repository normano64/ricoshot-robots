var express = require('express');
var cookieParser = require('cookie');
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

/* The Home room should always exist. */
var rooms = [{
    uuid: 'home',
    name: 'Home',
    isPublic: false,
    players: [],
    drinking: false,
    turns: 0,
    chatHistory: []
}];
var users = [];
var emptyRooms = [];

io.use(function(socket, next) {
    var cookie = cookieParser.parse(socket.request.headers.cookie);
    var nick = (cookie.rsrnick ? decodeURIComponent(cookie.rsrnick) : null);
    if(nick && nick.length <= 16) {
        socket.nick = nick;
    }
    next();
});

// Handles socket.io connections.
io.on('connection', function(socket) {
    /* Set the room to home to prevent the user for entering limbo. */
    socket.room = 'home';
    socket.join(socket.room);
    if(socket.nick) {
        var nick = socket.nick;
        if(nick.length <= 16) {
            socket.nick = nick;
        }
    } else {
        socket.nick = 'Guest';
        var nick = 'Guest';
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
    socket.emit('new_nick', socket.nick);
    console.log(socket.nick + ' joined ' + _.find(rooms, { uuid: socket.room}).name);
    
    // The user wants to join a room.
    socket.on('join_room', function(uuid) {
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

                socket.emit('joined_room', rooms[roomIndex]);

                if(socket.room != 'home') {
                    var time = (new Date()).getTime();
                    io.to(socket.room).emit('player_joined', socket.nick, time);
                    saveToChatHistory(socket.nick + ' joined the room', time, false);
                }
                if(rooms[roomIndex].isPublic) {
                    io.to('home').emit('players_in_room', socket.room, rooms[roomIndex].players.length);
                }
            } else {
                socket.emit('go_to_room', 'home');
            }
        }
    });

    // The user wants to leave room if in one.
    socket.on('leave_room', function() {
        if(socket.room != 'home') {
            var oldRoomName = _.find(rooms, { uuid: socket.room }).name;
            socket.leave(socket.room);
            removeUserFromRoom();
            socket.room = 'home';
            socket.join(socket.room);
            console.log(socket.nick + ' left ' + oldRoomName  + ' and joined ' + _.find(rooms, { uuid: socket.room }).name);
        }
    });

    // The user wants to join a room, leaves the old room if any.
    socket.on('create_room', function(name, isPublic, drinking) {
        if(_.findIndex(rooms, { name: name }) == -1 && name && socket.room == 'home') {
            // Create room with a uuid and general game stuff.
            var room = {
                uuid: uuid.v4(),
                name: name,
                isPublic: (isPublic ? true : false),
                players: [],
                drinking: (drinking ? true : false),
                turns: 0,
                chatHistory: []
            }
            rooms.push(room);
            console.log(socket.nick + ' created ' + room.name);

            if(room.isPublic) {
                io.to('home').emit('new_room', {
                    uuid: room.uuid,
                    name: room.name,
                    players: room.players.length,
                    drinking: room.drinking,
                    turns: room.turns
                });
            }
            socket.emit('go_to_room', room.uuid);
        } else {
            socket.emit('room_already_exists');
        }
    });

    // Tell what rooms that are public.
    socket.on('current_rooms', function() {
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
        socket.emit('current_rooms', publicRooms);
    });

    // User wants new nick, checks if available.
    socket.on('set_nick', function(nick) {
        if(nick && nick.length <= 16) {
            var i = 1;
            var oldNick = socket.nick;
            socket.nick = nick;
            while(_.findIndex(users, { nick: socket.nick }) != -1) {
                i *= 10;
                socket.nick = nick + Math.ceil(Math.random() * i);
            }
            _.find(users, { id: socket.id.substr(2) }).nick = socket.nick;
            socket.emit('set_cookie', encodeURIComponent(socket.nick));
            socket.emit('new_nick', socket.nick);
            console.log(oldNick + ' changed nick to ' + socket.nick);
            if(socket.room != 'home') {
                var time = (new Date()).getTime();
                io.to(socket.room).emit('player_changed_nick', oldNick, socket.nick, time);
                saveToChatHistory(oldNick + ' changed nick to ' + socket.nick, time, false);
            }
        }
    });

    // Broadcast chat message to all users in the same room.
    socket.on('chat_message', function(message) {
        if(socket.room != 'home') {
            var time = (new Date()).getTime();
            io.to(socket.room).emit('chat_message', socket.nick, message, time, true);
            saveToChatHistory(message, time, true);
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
            var time = (new Date()).getTime();
            io.to(socket.room).emit('player_left', socket.nick, time);
            saveToChatHistory(socket.nick + ' left the room', time, false);
            
            var roomIndex = _.findIndex(rooms, { uuid: socket.room});
            rooms[roomIndex].players.splice(rooms[roomIndex].players.indexOf(socket.id.substr(2)), 1);
            io.to('home').emit('players_in_room', socket.room, rooms[roomIndex].players.length);
            
            if(rooms[roomIndex].players.length == 0 && _.findIndex(emptyRooms, { uuid: socket.room }) == -1) {
                emptyRooms.push({
                    uuid: socket.room,
                    added: time
                });
            }
        }
    }

    // Save chat message to the rooms chat log.
    function saveToChatHistory(message, time, isPlayer) {
        var roomIndex = _.findIndex(rooms, { uuid: socket.room });
        if(rooms[roomIndex].chatHistory.length >= 20) {
            rooms[roomIndex].chatHistory.splice(0, 1);
        }
        rooms[roomIndex].chatHistory.push({
            nick: (isPlayer ? socket.nick : null),
            message: message,
            time: time,
            isPlayer: isPlayer
        });
    }
});

/* Remove rooms thats been empty for at least 1 minute. */
function cleanEmptyRooms() {
    var pastTime = (new Date()).getTime() - 60000;
    var currentEmptyRooms = emptyRooms;
    emptyRooms = [];

    currentEmptyRooms.forEach(function(room) {
        var roomIndex = _.findIndex(rooms, { uuid: room.uuid});
        if(rooms[roomIndex].players.length == 0) {
            if(room.added < pastTime) {
                if(rooms[roomIndex].isPublic) {
                    io.to('home').emit('removed_room', room.uuid);
                }
                console.log('Removed ' + rooms[roomIndex].name + ' because it was empty');
                rooms.splice(roomIndex, 1);
            } else {
                emptyRooms.push(room);
            }
        }
    });
}

/* Run the room clean up at 1 minute interval. */
var timer = setInterval(cleanEmptyRooms, 60000);
