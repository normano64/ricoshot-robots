<template>
    <div id="create">
        <h2>Start a new game</h2>
        <form @submit.prevent="createRoom">
            <input type="text" v-model="name" placeholder="Game name" autocomplete="off"/>
            <label :class="{'active': isPublic}">
                <svg class="icon" v-if="isPublic"><use xlink:href="static/sprite.svg#icon-checkbox"/></svg>
                <svg class="icon" v-if="!isPublic"><use xlink:href="static/sprite.svg#icon-checkbox-blank"/></svg>
                <input type="checkbox" v-model="isPublic"/>Public game
            </label>
            <label :class="{'active': drinking}">
                <svg class="icon" v-if="drinking"><use xlink:href="static/sprite.svg#icon-checkbox"/></svg>
                <svg class="icon" v-if="!drinking"><use xlink:href="static/sprite.svg#icon-checkbox-blank"/></svg>
                <input type="checkbox" v-model="drinking"/>Drinking mode
            </label>
            <input type="submit" value="Create game"/>
        </form>
    </div>
    <div id="roomlist">
        <h2>Public games</h2>
        <label>
            <input type="text" name="query" v-model="searchQuery" placeholder="Room name" autocomplete="off"/>
            <svg class="icon"><use xlink:href="static/sprite.svg#icon-search"/></svg>
        </label>
        <ul>
            <li v-for="room in rooms | filterBy searchQuery in 'name'">
                <a v-link="'/room/' + room.uuid">
                    <div>
                        <span class="name">{{room.name}}</span>
                        <span>{{room.players}} {{room.players | plural 'player'}}, {{room.turns}} {{room.turns | plural 'turn'}} played</span>
                    </div>
                    <svg class="icon" v-if="room.drinking"><use xlink:href="static/sprite.svg#icon-drink"/></svg>
                    <svg class="icon"><use xlink:href="static/sprite.svg#icon-join"/></svg>
                </a>
            </li>
            <li class="error" v-if="!rooms.length">There's no public games right now</li>
            <li class="error" v-if="!filteredRooms.length && searchQuery">No games found</li>
        </ul>
    </div>
</template>

<script>
 import _ from 'lodash';
 import api from '../../api.js';

 export default {
     name: 'HomeView',
     data () {
         return {
             isPublic: false,
             drinking: false,
             name: '',
             searchQuery: '',
             rooms: []
         }
     },
     filters: {
         plural: function(value, word) {
             if(value == 1) {
                 return word;
             } else {
                 return word + 's';
             }
         }
     },
     computed: {
         filteredRooms: function () {
             return this.$options.filters.filterBy(this.rooms, this.searchQuery);
         }
     },
     methods: {
         newRoom(room) {
             console.log(room);
             this.rooms.push(room);
         },
         removeRoom(uuid) {
             var index = _.findIndex(this.rooms, { uuid: uuid });
             if(index != -1) {
                 this.rooms.splice(index, 1);
             }
         },
         currentRooms(rooms) {
             this.rooms = rooms;
         },
         playersInRoom(uuid, numPlayers) {
             rooms[_.findIndex(this.rooms, { uuid: uuid })].players = numPlayers;
         },
         createRoom() {
             api.createRoom(this.name, this.isPublic, this.drinking);
         }
     },
     attached () {
         this.$dispatch('changeTitle');
     },
     created () {
         api.currentRooms();
         api.on('newRoom', this.newRoom);
         api.on('removeRoom', this.removeRoom);
         api.on('currentRooms', this.currentRooms);
         api.on('playersInRoom', this.playersInRoom);
     },
     destroyed () {
         api.removeListener('newRoom', this.newRoom);
         api.removeListener('removeRoom', this.removeRoom);
         api.removeListener('currentRooms', this.currentRooms);
         api.removeListener('playersInRoom', this.playersInRoom);
     }
 }
</script>

<style lang="sass">
 @import "variables";
 @import 'mixin';

 #create {
     width:640px;
     float:left;
     padding:12px;
     h2 {
         text-align:center;
     }
     form {
         width:300px;
         margin:0 auto;
         label {
             color:$gray;
             cursor:pointer;
             display:block;
             font-size:1.1em;
             user-select:none;
             line-height:38px;
             margin:6px 0;
             /* background:$white-dark; */
             text-align:center;
             &.active {
                 /* background:$gray-light; */
                 color:$primary;
                 svg.icon {
                     fill:$primary;
                 }
             }
             input[type=checkbox] {
                 display:none;
             }
             svg.icon {
                 height:18px;
                 width:18px;
                 margin:10px -30px 10px 12px;
                 float:left;
                 fill:$gray;
             }
         }
     }
     @include respond-to(small-medium) {
         float:none;
         width:100%;
     }
 }
 #roomlist {
     width:360px;
     float:right;
     padding:12px;
     h2 {
         text-align:center;
     }
     label {
         display:flex;
         svg.icon {
             width:38px;
             height:38px;
             padding:7px;
             float:right;
             background:$primary;
             fill:white;
             margin:6px 0;
             cursor:pointer;
             border:0;
         }
         input[type=text] {
             flex:1;
             font-size:1.1em;
             padding:0 12px;
             line-height:36px;
             margin:6px 0;
             border:1px solid $gray-light;
             color:$gray;
         }
     }
     ul {
         list-style:none;
         border:1px solid $gray-light;
         li {
             a {
                 &:link, &:visited {
                     padding:6px 12px;
                     display:flex;
                     text-decoration:none;
                     color:$gray;
                     font-size:.8em;
                     height:50px;
                     .name {
                         display:block;
                         font-size:1.3em;
                     }
                     div {
                         flex:1;
                     }
                     svg.icon {
                         fill:$gray;
                         float:right;
                         height:24px;
                         width:24px;
                         margin:7px 0 7px;
                         + svg.icon {
                             margin-left:8px;
                         }
                     }
                 }
                 &:hover, &:active {
                     color:white;
                     background:$primary;
                     svg.icon {
                         fill:white;
                     }
                 }
             }
             &.error {
                 text-align:center;
                 display:block;
                 line-height:50px;
                 font-size:1.1em;
             }
             &:not(:last-child) {
                 border-bottom:1px solid $gray-light;
             }
         }
     }
     @include respond-to(medium) {
         float:none;
         margin:0 auto;
     }
     @include respond-to(small) {
         float:none;
         width:100%;
     }
 }
</style>
