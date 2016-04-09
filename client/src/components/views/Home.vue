<template>
    <div id="create">
        <h2>Start a new game</h2>
        <form>
            <input type="text" name="name" placeholder="Game name" autocomplete="off"/>
            <input type="text" name="nick" placeholder="Nickname" autocomplete="off"/>
            <label :class="{'active': checkPrivate}">
                <svg class="icon" v-if="checkPrivate"><use xlink:href="static/sprite.svg#icon-checkbox"/></svg>
                <svg class="icon" v-if="!checkPrivate"><use xlink:href="static/sprite.svg#icon-checkbox-blank"/></svg>
                <input type="checkbox" v-model="checkPrivate"/>Private game
            </label>
            <label :class="{'active': checkDrink}">
                <svg class="icon" v-if="checkDrink"><use xlink:href="static/sprite.svg#icon-checkbox"/></svg>
                <svg class="icon" v-if="!checkDrink"><use xlink:href="static/sprite.svg#icon-checkbox-blank"/></svg>
                <input type="checkbox" v-model="checkDrink"/>Drinking mode
            </label>
            <input type="submit" name="query" value="Create game"/>
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
                <a v-link="'/room/' + room.id">
                    <div>
                        <span class="name">{{room.name}}</span>
                        <span>{{room.players}} players</span>
                    </div>
                    <svg class="icon"><use xlink:href="static/sprite.svg#icon-join"/></svg>
                </a>
            </li>
            <li class="error" v-if="!rooms.length">There's no public games right now</li>
            <li class="error" v-if="!filteredRooms.length">No games found</li>
        </ul>
    </div>
</template>

<script>
 export default {
     name: 'HomeView',
     data () {
         return {
             searchQuery: '',
             rooms: [
                 {
                     id: '123',
                     name: 'Ost',
                     players: '1337',
                     rounds: '3'
                 },
                 {
                     id: '1234',
                     name: 'Hest',
                     players: '1337',
                     rounds: '3'
                 }
             ]
         }
     },
     computed: {
         filteredRooms: function () {
             return this.$options.filters.filterBy(this.rooms, this.searchQuery);
         }
     },
     attached () {
         this.$dispatch('changeTitle', 'Home');
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
         input[type=text] {
             display:block;
             font-size:1.1em;
             padding:0 12px;
             line-height:36px;
             margin:6px 0;
             border:1px solid $gray-light;
             color:$gray;
             width:100%;
         }
         label {
             color:$gray;
             cursor:pointer;
             display:block;
             font-size:1.1em;
             user-select:none;
             line-height:38px;
             margin:6px 0;
             background:$white-dark;
             text-align:center;
             &.active {
                 background:$gray-light;
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
         input[type=submit] {
             display:block;
             font-size:1.1em;
             padding:0 12px;
             line-height:36px;
             margin:6px 0;
             border:0;
             color:white;
             background:$primary;
             width:100%;
             margin:6px 0;
             cursor:pointer;
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
