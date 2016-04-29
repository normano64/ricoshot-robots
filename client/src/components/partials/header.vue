<template>
    <header id="header">
        <div class="container">
            <span id="brand" v-link="'/'">Ricoshot Robots</span>
            <span class="right" @click="$dispatch('showNickModal')">
                {{ nick }}<svg class="icon"><use xlink:href="/static/sprite.svg#icon-person"/></svg>
            </span>
        </div>
    </header>
</template>

<script>
 import store from '../../store';

 export default {
     name: 'headerPartial',
     data() {
         return {
             nick: store.nick
         }
     },
     methods: {
         newNick(nick) {
             this.nick = nick;
         }
     },
     created() {
         store.on('new_nick', this.newNick);
     },
     destroyed () {
         store.removeListener('new_nick', this.newNick);
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
         span {
             padding:0 12px;
             cursor:pointer;
             line-height:54px;
             float:left;
             svg.icon {
                 height:24px;
                 width:25px;
                 fill:white;
                 margin:15px 0 15px 8px;
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
     }
 }
 #brand {
     font-size:1.1em;
     font-weight:700;
 }
</style>