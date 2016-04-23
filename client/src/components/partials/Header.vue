<template>
    <header id="header">
        <div class="container">
            <span id="brand">Ricoshot Robots</span>
            <span class="right" @click="$dispatch('showNickModal')">
                {{ nick }}<svg class="icon"><use xlink:href="static/sprite.svg#icon-person"/></svg>
            </span>
        </div>
    </header>
</template>

<script>
 import api from '../../api.js';

 export default {
     name: 'HeaderPartial',
     data() {
         return {
             nick: ''
         }
     },
     methods: {
         newNick(nick) {
             this.nick = nick;
         }
     },
     created() {
         api.on('newNick', this.newNick);
     },
     destroyed () {
         api.removeListener('newNick', this.newNick);
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
     box-shadow:0 2px 5px rgba(0,0,0,.25);
     font-size:1rem;
     .container {
         width:1000px;
         margin:0 auto;
         @include respond-to(small-medium) {
             width:100%;
         }
         span:not(#brand) {
             padding:0 12px;
             cursor:pointer;
             svg.icon {
                 height:24px;
                 width:25px;
                 fill:white;
                 margin:15px 0 15px 8px;
             }
             &:hover {
                 background:white;
                 color:$gray;
                 svg.icon {
                     fill:$gray;
                 }
             }
         }
     }
 }
 #brand {
     font-size:1.1em;
     font-weight:700;
     padding:0 12px;
     cursor:default;
 }
</style>
