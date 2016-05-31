<template>
    <div id="chat">
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
     display:flex;
     flex-flow:column;
     width:320px;
     height:512px;
     padding:12px;
     position:absolute;
     right: 0;
     transition:transform .3s ease;
     &.show {
	     transform:translateX(320px);
     }
     h2 {
         text-align:center;
     }
     .content {
         border:1px solid $gray-light;
         overflow:auto;
         flex:1;
     }
     ul {
         min-height:100%;
         list-style:none;
         padding:12px 0 0;
         display:flex;
         flex-flow:column;
         justify-content:flex-end;
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
