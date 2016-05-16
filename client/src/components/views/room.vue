<template>
    <div>
	<div id="board">
	    <winner-partial v-if="winnerToggle" :winner="winner" transition="top"></winner-partial>
	    <a href="#" @click.prevent="toggleWinner">test winner</a>
	    <div class="overlay" v-if="winnerToggle" transition="opacity"></div>
	</div>
	<chat-partial :messages="messages"></chat-partial>
    </div>
</template>

<script>
 import store from '../../store';
 import chatPartial from '../partials/chat.vue';
 import winnerPartial from '../partials/winner.vue';
 
 export default {
     name: 'roomView',
     components: {
         chatPartial,
	 winnerPartial
     },
     data() {
         return {
             messages: [],
	     winner: 'Steve',
	     winnerToggle: false
         }
     },
     methods: {

	 toggleWinner() {
	     this.winnerToggle = !this.winnerToggle;
	 },
         joinedRoom(room) {
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
         },
	 showWinnerModal() {
             this.Modal = true;
             this.overlayClickListener = true;
             this.overlay = true;
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
 
 #board {
     width:680px;
     height:512px;
     float:left;
     position:relative;
     padding:12px;
     .modal {
	 position:absolute;
	 left:0;
	 right:0;
	 width:300px;
	 margin:0 auto;
	 top:120px;
	 padding:12px 18px;
	 box-shadow:0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
	 background:white;
	 h3 {
	     text-align:center;
	     font-size:2.0em;
	 }
	 &.top-transition {
             transition:all .3s ease;
             transform:translateY(0px);
             opacity:1;
	 }
	 &.top-enter, &.top-leave {
             transform:translateY(-200px);
             opacity:0;
	 }
     }
     .overlay {
	 position:absolute;
	 display:block;
	 height:120%;
	 width:100%;
	 top:0;
	 left:0;
	 background:rgba(0,0,0,.5);
	 z-index:99;
	 &.opacity-transition {
             transition:all .3s ease;
             opacity:1;
	 }
	 &.opacity-enter, &.opacity-leave {
             opacity:0;
	 }
     }
 }
 
</style>
