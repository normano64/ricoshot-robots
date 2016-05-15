<template>
    <li class="chat-message" :class="{ 'self': isSelf(message.nick), 'server': !message.isPlayer }">
        <div class="message" v-if="message.isPlayer">
            <span v-if="!isSelf(message.nick)">{{ message.nick }}</span>{{ message.message }}
        </div>
        <div class="message" v-if="!message.isPlayer">
            {{ t(message.message, message.args) }}
        </div>
        <span class="time" v-if="message.isPlayer">{{ message.time | time }}</span>
    </li>
</template>

<script>
 import store from '../../store';

 export default {
     name: 'chatMessagePartial',
     props: ['message'],
     filters: {
         time(text) {
             var time = new Date(text);
             return time.getHours() + ':' + ('0' + time.getMinutes()).substr(-2) + ':' + ('0' + time.getSeconds()).substr(-2);
         }
     },
     methods: {
         isSelf(nick) {
             return (nick == store.nick)
         }
     },
     attached() {
         this.$dispatch('scroll');
     }
 }
</script>

<style lang="sass">
 @import "variables";
 @import 'mixin';

 .chat-message {
     padding:0 8px 12px;
     line-height:32px;
     display:flex;
     align-items:center;
     font-size:.85em;
     .message {
         background:$white-dark;
         padding:6px 8px;
         line-height:20px;
         word-break:word-all;
         max-width:calc(100% - 40px);
         overflow:hidden;
         border-radius:8px 8px 8px 0;
         span {
             font-weight:600;
             &:after {
                 content:': ';
                 font-weight:400;
             }
         }
     }
     .time {
         transition:opacity .3s ease;
         font-size:.75em;
         opacity:0;
         user-select:none;
         cursor:default;
         margin-left:4px;
         padding:0 4px;
         line-height:20px;
     }
     &:hover {
         .time {
             opacity:1;
         }
     }
     &.self {
         flex-direction:row-reverse;
         .message {
             background:$primary;
             color:white;
             border-radius:8px 8px 0 8px;
         }
         .time {
             margin-left:0;
             margin-right:4px;
         }
     }
     &.server {
         line-height:20px;
         .message {
             padding:0;
             background:none;
             text-align:center;
             width:100%;
             max-width:100%;
             font-size:.75em;
         }
     }
 }
</style>
