<template>
    <div id="board">
        <div class="nicklist">
            <div v-for="player in players">
                {{ player.nick }}
                <span v-if="player.steps > 0">
                    {{ player.steps }}
                    <svg class="icon"><use xlink:href="/static/sprite.svg#icon-steps"/></svg>
                </span>
            </div>
        </div>
        <div class="map">
            <canvas-partial :walls="walls" :goals="goals" :robots="robots" :board="board" :current-goal="currentGoal"></canvas-partial>
            <div class="overlay" v-if="winnerToggle" transition="opacity"></div>
            <winner-partial v-if="winnerToggle" :winner="winner" transition="top"></winner-partial>
        </div>
        <chat-partial :class="{ 'show': chatToggle }" :messages="messages"></chat-partial>
    </div>
</template>
<script>
 import _ from 'lodash';
 import store from '../../store';
 import chatPartial from '../partials/chat.vue';
 import winnerPartial from '../partials/winner.vue';
 import canvasPartial from '../partials/canvas.vue';

 export default {
     name: 'roomView',
     components: {
         chatPartial,
         winnerPartial,
         canvasPartial
     },
     data() {
         return {
             messages: [],
             winner: 'Steve',
             winnerToggle: false,
             chatToggle: false,
             walls: [],
             goals: [],
             robots: [],
             players: [],
             board: [],
             currentGoal: null
         }
     },
     methods: {
         toggleChat() {
             this.chatToggle = !this.chatToggle;
         },
         toggleWinner() {
             this.winnerToggle = !this.winnerToggle;
         },
         joinedRoom(room) {
             console.log(room);
             this.$dispatch('changeTitle', 'in ' + room.name);
             this.messages = room.chatHistory;
             this.walls = room.walls;
             this.goals = room.goals;
             this.robots = room.robots;
             this.board = room.board;
             this.currentGoal = room.currentGoal;
             console.log(room.currentGoal);
             this.players = [];
             room.players.forEach((nick) => {
                 this.players.push({
                     nick: nick,
                     wins: 0,
                     steps: 0
                 });
             });
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
             if(_.findIndex(this.players, { nick: nick }) == -1) {
                 this.players.push({
                     nick: nick,
                     wins: 0,
                     steps: 0
                 });
             }
             this.messages.push({
                 nick: null,
                 message: 'joined_room',
                 time: time,
                 isPlayer: false,
                 args: [nick]
             });
         },
         playerLeft(nick, time) {
             this.players.splice(_.findIndex(this.players, { nick: nick }), 1);
             this.messages.push({
                 nick: null,
                 message: 'left_room',
                 time: time,
                 isPlayer: false,
                 args: [nick]
             });
         },
         playerChangedNick(oldNick, newNick, time) {
             this.players[_.findIndex(this.players, { nick: oldNick })].nick = newNick;
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
             this.winnerToggle = true;
             this.overlayClickListener = false;
             this.overlay = true;
         },
         showSubmitModal(moves) {
             console.log("woop2", moves);
             this.winner = store.nick;
             this.winnerToggle = true;
             this.overlayClickListener = false;
             this.overlay = true;
         },
         userSteps(nick, steps) {
             console.log(nick, steps);
             var playerIndex = _.findIndex(this.players, { nick: nick });
             this.players[playerIndex].steps = steps;
         }
     },
     attached() {
         store.emit('join_room', this.$route.params.uuid);
         store.on('joined_room', this.joinedRoom);
         store.on('chat_message', this.chatMessage);
         store.on('player_joined', this.playerJoined);
         store.on('player_left', this.playerLeft);
         store.on('player_changed_nick', this.playerChangedNick);
         store.on('user_steps', this.userSteps);
         store.on('reconnect', this.reconnected);
         store.event.on('toggle_chat', this.toggleChat);
         store.event.on('show_submit', this.showSubmitModal);
     },
     detached() {
         store.removeListener('joined_room', this.joinedRoom);
         store.removeListener('chat_message', this.chatMessage);
         store.removeListener('player_joined', this.playerJoined);
         store.removeListener('player_left', this.playerLeft);
         store.removeListener('player_changed_nick', this.playerChangedNick);
         store.removeListener('user_steps', this.userSteps);
         store.removeListener('reconnect', this.reconnected);
         store.event.removeListener('toggle_chat', this.toggleChat);
         store.event.removeListener('show_submit', this.showSubmitModal);
         store.emit('leave_room');
     }
 }
</script>

<style lang="sass">
 @import "variables";
 @import 'mixin';

 #board {
     position:relative;
     padding:12px;
     flex:1;
     overflow:hidden;
     display:flex;
     justify-content:space-between;
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
         z-index:50;
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
     .nicklist {
         width:177px;
         div {
             height:30px;
             line-height:30px;
         }
         svg.icon {
             width:24px;
             height:24px;
         }
     }
     .overlay {
	     position:absolute;
	     display:block;
	     height:100%;
	     width:100%;
	     top:0;
	     left:0;
	     background:rgba(0,0,0,.5);
	     z-index:49;
	     &.opacity-transition {
             transition:all .3s ease;
             opacity:1;
	     }
	     &.opacity-enter, &.opacity-leave {
             opacity:0;
	     }
     }
     .map {
         width:518px;
         height:558px;
         position:relative;
     }
     #chat {
         width:277px;
         height:518px;
         transition:transform .3s ease;
         background:white;
         &.show {
	         transform:translateX(320px);
         }
         @include respond-to(small-medium) {
             position:absolute;
             right:0;
             z-index:99
         }
     }
 }
</style>
