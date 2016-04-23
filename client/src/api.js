import io from 'socket.io-client';
import { EventEmitter } from 'events';

const store = new EventEmitter()
const socket = io(':3000');

export default store

// When connection to the server is established.
socket.on('connect', function() {
    var nick = getCookieValue('rsrnick');
    if(nick == '') {
        socket.emit('getNick');
    } else {
        socket.emit('setNick', nick);
    }
});

// Server was disconnected.
socket.on('disconnect', function() {
    store.emit('disconnect');
});

// Emit add room event to listener.
socket.on('newRoom', function(room) {
    store.emit('newRoom', room);
});

// Emit remove room event to listener.
socket.on('removeRoom', function(uuid) {
    console.log(uuid);
    store.emit('removeRoom', uuid);
});

// User joined a room.
socket.on('joinedRoom', function(room) {
    console.log('joinedRoom', room);
});

// User joined a room.
socket.on('playersInRoom', function(uuid, numPlayers) {
    console.log('playersInRoom', uuid, numPlayers);
});

// Emit new nick event to listener.
socket.on('newNick', function(nick) {
    document.cookie = 'rsrnick=' + nick;
    store.emit('newNick', nick);
});

// Event with current existing rooms.
socket.on('currentRooms', function(rooms) {
    store.emit('currentRooms', rooms);
});

// Disconnect from server.
store.disconnect = () => {
    socket.disconnect();
}

// Sends setNick event to server.
store.setNick = (nick) => {
    socket.emit('setNick', nick);
}

// Ask server for public rooms.
store.currentRooms = () => {
    socket.emit('currentRooms');
}

// Join room on the server for listening to events.
store.joinRoom = (uuid) => {
    socket.emit('joinRoom', uuid);
}

// Leave room on the server.
store.leaveRoom = () => {
    socket.emit('leaveRoom');
}

// Create room on the server.
store.createRoom = (name, isPublic, drinking) => {
    socket.emit('createRoom', name, isPublic, drinking);
}


// From http://stackoverflow.com/a/25490531
function getCookieValue(name) {
    var cookie = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookie ? cookie.pop() : '';
}
