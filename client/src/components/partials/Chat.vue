<template>
    <div id="chat">
        <h2>Chat</h2>
        <div v-el:chat class="content">
            <ul>
                <li v-for="message in messages" :class="{ 'self': message.self }">
                    <avatar-partial :nick="message.nick" :full="true" v-if="!message.self"></avatar-partial>
                    <div class="message">{{ message.text }}<span>{{ message.time | time }}</span></div>
                </li>
            </ul>
        </div>
        <label>
            <input type="text" v-model="chatInput" autocomplete="off" @keyup.enter="sendMessage"/>
            <svg class="icon"><use xlink:href="/static/sprite.svg#icon-chat" @click="sendMessage"/></svg>
        </label>
    </div>
</template>

<script>
 import api from '../../api.js';
 import AvatarPartial from './Avatar.vue';

 export default {
     name: 'chatPartial',
     data() {
         return {
             chatInput: '',
             messages: []
         }
     },
     components: {
         AvatarPartial
     },
     filters: {
         time(text) {
             var time = new Date(text);
             return time.getHours() + ':' + ('0' + time.getMinutes()).substr(-2);
         }
     },
     methods: {
         chatMessage(nick, message, time, self) {
             if(this.$els.chat.scrollHeight - this.$els.chat.scrollTop <= this.$els.chat.offsetHeight) {
                 var _this = this;
                 setTimeout(function() {
                     _this.$els.chat.scrollTop = _this.$els.chat.scrollHeight;
                 }, 0);
             }
             this.messages.push({
                 nick: nick,
                 text: message,
                 time: time,
                 self: self
             });
         },
         sendMessage() {
             if(this.chatInput) {
                 api.sendMessage(this.chatInput);
                 this.chatInput = '';
             }
         }
     },
     attached() {
         api.on('chatMessage', this.chatMessage);
     },
     detached() {
         api.removeListener('chatMessage', this.chatMessage);
     }
 }
</script>

<style lang="sass">
 @import "variables";
 @import 'mixin';

 #chat {
     width:320px;
     height:512px;
     padding:12px;
     float:right;
     h2 {
         text-align:center;
     }
     .content {
         height:414px;
         border:1px solid $gray-light;
         overflow:auto;
     }
     ul {
         min-height:100%;
         list-style:none;
         padding:12px 0 0;
         overflow: auto;
         display:flex;
         flex-flow:column;
         justify-content:flex-end;
         li {
             padding:0 8px 12px;
             line-height:32px;
             display:flex;
             position:relative;
             .avatar {
                 margin:0 8px 0 0;
             }
             .message {
                 background:$white-dark;
                 padding:6px 8px;
                 line-height:20px;
                 word-break:break-all;
                 max-width:calc(100% - 60px);
                 border-radius:8px 8px 8px 0;
                 position:relative;
                 span {
                     transition:opacity .3s ease;
                     font-size:.65em;
                     position:absolute;
                     bottom:-9px;
                     left:1px;
                     line-height:8px;
                     opacity:0;
                     user-select:none;
                     cursor:default;
                     pointer-events:none;
                     text-align:center;
                 }
             }
             &:hover {
                 .message span {
                     opacity:1;
                 }
             }
             &.self {
                 flex-direction:row-reverse;
                 align-items:flex-end;
                 .message {
                     border-radius:8px 8px 0 8px;
                     span {
                         left:initial;
                         right:2px;
                         text-align:right;
                     }
                 }
             }
         }
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
             cursor:pointer;
             margin:6px 0 0;
             border:0;
         }
         input[type=text] {
             flex:1;
             font-size:1.1em;
             padding:0 12px;
             line-height:36px;
             margin:6px 0 0;
             border:1px solid $gray-light;
             color:$gray;
         }
     }
     @include respond-to(small) {
         width:100%;
     }
 }
</style>
