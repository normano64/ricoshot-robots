<template>
    <div id="chat">
        <h2>Chat</h2>
        <div v-el:chat class="content">
            <ul>
                <chat-message-partial v-for="message in messages" :message="message"></chat-message-partial>
            </ul>
        </div>
        <label>
            <input type="text" v-model="chatInput" autocomplete="off" @keyup.enter="sendMessage"/>
            <svg class="icon" @click="sendMessage"><use xlink:href="/static/sprite.svg#icon-chat"/></svg>
        </label>
    </div>
</template>

<script>
 import store from '../../store';
 import chatMessagePartial from './chatMessage.vue';

 export default {
     name: 'chatPartial',
     props: ['messages'],
     data() {
         return {
             chatInput: '',
             scrollHeight: null
         }
     },
     components: {
         chatMessagePartial
     },
     events: {
         scroll() {
             if(this.scrollHeight - this.$els.chat.scrollTop <= this.$els.chat.offsetHeight) {
                 this.$nextTick(() => {
                     this.$els.chat.scrollTop = this.$els.chat.scrollHeight;
                 });
             }
             this.scrollHeight = this.$els.chat.scrollHeight
         }
     },
     methods: {
         sendMessage() {
             if(this.chatInput) {
                 store.emit('chat_message', this.chatInput);
                 this.chatInput = '';
             }
         }
     },
     attached() {
         this.scrollHeight = this.$els.chat.scrollHeight;
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
             &.server {
                 line-height:10px;
                 .message {
                     padding:0;
                     background:none;
                     text-align:center;
                     width:100%;
                     max-width:100%;
                     font-size:.75em;
                     span {
                         font-size:.87em;
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
