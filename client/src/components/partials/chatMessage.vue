<template>
    <li :class="{ 'self': isSelf(message.nick), 'server': !message.isPlayer }">
        <avatar-partial :nick="message.nick" :full="true" v-if="!isSelf(message.nick) && message.isPlayer"></avatar-partial>
        <div class="message">{{ message.message }}<span>{{ message.time | time }}</span></div>
    </li>
</template>

<script>
 import store from '../../store';
 import avatarPartial from './avatar.vue';

 export default {
     name: 'chatPartial',
     props: ['message'],
     components: {
         avatarPartial
     },
     filters: {
         time(text) {
             var time = new Date(text);
             return time.getHours() + ':' + ('0' + time.getMinutes()).substr(-2);
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
</style>
