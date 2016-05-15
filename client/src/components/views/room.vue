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
         chatMessage(nick, message, time, isPlayer) {
             this.messages.push({
                 nick: nick,
                 message: message,
                 time: time,
                 isPlayer: isPlayer
             });
         },
         playerJoined(nick, time) {
             this.messages.push({
                 nick: null,
                 message: 'joined_room',
                 time: time,
                 isPlayer: false,
                 args: [nick]
             });
         },
         playerLeft(nick, time) {
             this.messages.push({
                 nick: null,
                 message: 'left_room',
                 time: time,
                 isPlayer: false,
                 args: [nick]
             });
         },
         playerChangedNick(oldNick, newNick, time) {
             this.messages.push({
                 nick: null,
                 message: 'changed_nick',
                 time: time,
                 isPlayer: false,
                 args: [oldNick, newNick]
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
