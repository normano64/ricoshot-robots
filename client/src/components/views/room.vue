<template>
    <div>
        <chat-partial :messages="messages"></chat-partial>
    </div>
</template>

<script>
 import store from '../../store';
 import chatPartial from '../partials/chat.vue';

 export default {
     name: 'roomView',
     components: {
         chatPartial
     },
     data() {
         return {
             messages: []
         }
     },
     methods: {
         joinedRoom(room){
             console.log(room);
             this.messages = room.chatHistory;
             this.$dispatch('changeTitle', 'in ' + room.name);
         },
         chatMessage(nick, message, time, player) {
             this.messages.push({
                 nick: nick,
                 message: message,
                 time: time,
                 isPlayer: player
             });
         },
         playerJoined(nick, time) {
             this.messages.push({
                 nick: null,
                 message: nick + ' joined the room',
                 time: time,
                 isPlayer: false
             });
         },
         playerLeft(nick, time) {
             this.messages.push({
                 nick: null,
                 message: nick + ' left the room',
                 time: time,
                 isPlayer: false
             });
         },
         playerChangedNick(oldNick, newNick, time) {
             this.messages.push({
                 nick: null,
                 message: oldNick + ' changed nick to ' + newNick,
                 time: time,
                 isPlayer: false
             });
         },
         reconnected() {
             store.emit('join_room', this.$route.params.uuid);
         }
     },
     attached() {
         store.emit('join_room', this.$route.params.uuid);
         store.on('joined_room', this.joinedRoom);
         store.on('chat_message', this.chatMessage);
         store.on('player_joined', this.playerJoined);
         store.on('player_left', this.playerLeft);
         store.on('player_changed_nick', this.playerChangedNick);
         store.on('reconnect', this.reconnected);
     },
     detached() {
         store.removeListener('joined_room', this.joinedRoom);
         store.removeListener('chat_message', this.chatMessage);
         store.removeListener('player_joined', this.playerJoined);
         store.removeListener('player_left', this.playerLeft);
         store.removeListener('player_changed_nick', this.playerChangedNick);
         store.removeListener('reconnect', this.reconnected);
         store.emit('leave_room');
     }
 }
</script>

<style lang="sass">
 @import "variables";
 @import 'mixin';
</style>
