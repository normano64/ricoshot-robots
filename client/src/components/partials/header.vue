<template>
    <header id="header">
        <a v-link="'/'">
            <svg class="icon"><use xlink:href="/static/sprite.svg#icon-home"/></svg>
        </a>
        <span>Ricoshot Robots</span>
        <div class="title">{{ title }}</div>
        <a href="#" class="right" @click.prevent="$dispatch('showNickModal')">
            <span>{{ nick }}</span><svg class="icon"><use xlink:href="/static/sprite.svg#icon-person"/></svg>
        </a>
        <a href="#" class="right chat-button" @click.prevent="toggleChat()" v-if="$route.name == 'Room'">
            <svg class="icon"><use xlink:href="/static/sprite.svg#icon-chat"/></svg>
        </a>
        <a href="#" class="right" @click.prevent="changeLocale('en')" v-if="!currentLocale('en')">
            <svg class="icon"><use xlink:href="/static/sprite.svg#icon-english"/></svg>
        </a>
        <a href="#" class="right" @click.prevent="changeLocale('sv')" v-if="!currentLocale('sv')">
            <svg class="icon"><use xlink:href="/static/sprite.svg#icon-swedish"/></svg>
        </a>
    </header>
</template>

<script>
 import store from '../../store';

 export default {
     name: 'headerPartial',
     props: ['locale'],
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
             this.title = room.name;
         },
         leftRoom() {
             this.title = null;
         },
         changeLocale(locale) {
             this.$dispatch('changeLocale', locale);
         },
         currentLocale(locale) {
             return this.locale === locale;
         },
         toggleChat() {
             store.event.emit('toggle_chat');
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
         z-index:1;
         padding:0 15px;
         line-height:54px;
         float:left;
         text-align:center;
         text-decoration:none;
         color:white;
         position:relative;
         span + svg.icon {
             margin-left: 8px;
         }
         &.right {
             float:right;
         }
     }
     svg.icon {
         height:24px;
         width:24px;
         fill:white;
         margin:15px 0;
         &.language {
             margin-left:8px;
             cursor:pointer;
         }
     }
     a:hover, a:active {
         background:white;
         color:$gray;
         svg.icon {
             fill:$gray;
         }
     }
     .title {
         position:absolute;
         left:0;
         right:0;
         top:0;
         margin:0 auto;
         text-align:center;
         z-index:0;
     }
     > span {
         z-index:1;
         position:relative;
         padding:0 8px;
     }
     .chat-button {
         display:none;
         @include respond-to(small-medium) {
             display:block;
         }
     }
 }
</style>
