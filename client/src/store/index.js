import io from 'socket.io-client';
import { EventEmitter } from 'events';

const store = io(':3000');

export default store;

/* Server asked for a session cookie to be created. */
store.on('create_cookie', (sessionId) => {
    document.cookie = 'rsrnick=' + sessionId + ';path=/';
});

/* Store the player nick */
store.on('new_nick', (nick) => {
    store.nick = nick;
});
