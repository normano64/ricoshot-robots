import io from 'socket.io-client';
import { EventEmitter } from 'events';

const store = new EventEmitter()
const socket = io(':3000', { query: 'nick=' + getCookieValue('rsrnick')});

export default store

// When connection to the server is established.
socket.on('connect', function() {
    store.emit('connected');
});

socket.on('connect_error', function() {
    store.emit('notConnected', 'The server is offline');
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
    store.emit('removeRoom', uuid);
});

// User joined a room.
socket.on('joinedRoom', function(room) {
    store.emit('joinedRoom', room);
});

// Server wants user to go to room.
socket.on('goRoom', function(uuid) {
    store.emit('goRoom', uuid);
});

// User joined a room.
socket.on('playersInRoom', function(uuid, numPlayers) {
    store.emit('playersInRoom', uuid, numPlayers);
});

// Emit new nick event to listener.
socket.on('newNick', function(nick) {
    document.cookie = 'rsrnick=' + encodeURIComponent(nick);
    store.emit('newNick', nick);
    store.nick = nick;
});

// Event with current existing rooms.
socket.on('currentRooms', function(rooms) {
    store.emit('currentRooms', rooms);
});

// Event for received chat message.
socket.on('chatMessage', function(nick, message, time) {
    store.emit('chatMessage', nick, message, time, (store.nick == nick ? true : false));
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

// Ask for info for the room.
store.goRoom = (uuid) => {
    socket.emit('goRoom', uuid);
}

// Create room on the server.
store.createRoom = (name, isPublic, drinking) => {
    socket.emit('createRoom', name, isPublic, drinking);
}

// Send chat message.
store.sendMessage = (message) => {
    socket.emit('chatMessage', message);
}

// From http://stackoverflow.com/a/25490531
function getCookieValue(name) {
    var cookie = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookie ? cookie.pop() : '';
}
