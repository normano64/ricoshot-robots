<template>
    <header id="header">
        <a v-link="'/'">
            <svg class="icon"><use xlink:href="/static/sprite.svg#icon-home"/></svg>
        </a>
        <span>Ricoshot Robots{{ title }}</span>
        <a href="#" class="right" @click.prevent="$dispatch('showNickModal')">
            <span class="medium-large">{{ nick }}</span><svg class="icon"><use xlink:href="/static/sprite.svg#icon-person"/></svg>
        </a>
    </header>
</template>

<script>
 import store from '../../store';

 export default {
     name: 'headerPartial',
     data() {
         return {
             nick: store.nick,
             title: null
         }
     },
     methods: {
         newNick(nick) {
             this.nick = nick;
         },
         joinedRoom(room) {
             this.title = ' / ' + room.name;
         },
         leftRoom() {
             this.title = null;
         }
     },
     created() {
         store.on('new_nick', this.newNick);
         store.on('joined_room', this.joinedRoom);
         store.on('left_room', this.leftRoom);
     },
     destroyed () {
         store.removeListener('new_nick', this.newNick);
         store.removeListener('joined_room', this.joinedRoom);
         store.removeListener('left_room', this.leftRoom);
     }
 }
</script>

<style lang="sass">
 @import "variables";
 @import 'mixin';
 
 #header {
     line-height:54px;
     height:54px;
     background:$primary;
     color:white;
     box-shadow:0 2px 2px rgba(0,0,0,.25);
     position:relative;
     font-size:1rem;
     width:100%;
     font-weight:700;
     a:link, a:visited {
         padding:0 15px;
         line-height:54px;
         float:left;
         text-align:center;
         text-decoration:none;
         color:white;
         user-select:none;
         span + svg.icon {
             margin-left: 8px;
         }
         svg.icon {
             height:24px;
             width:24px;
             fill:white;
             margin:15px 0;
         }
         &.right {
             float:right;
         }
         &:hover {
             background:white;
             color:$gray;
             svg.icon {
                 fill:$gray;
             }
         }
     }
     > span {
         padding:0 8px;
     }
 }
</style>
