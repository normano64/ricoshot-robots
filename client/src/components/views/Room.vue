<template>
    <div>
        <chat-partial></chat-partial>
    </div>
</template>

<script>
 import api from '../../api.js';
 import ChatPartial from '../partials/Chat.vue';

 export default {
     name: 'RoomView',
     components: {
         ChatPartial
     },
     methods: {
         joinedRoom(room){
             this.$dispatch('changeTitle', 'in ' + room.name);
         }
     },
     attached() {
         api.joinRoom(this.$route.params.uuid);
         api.on('joinedRoom', this.joinedRoom);
     },
     detached() {
         api.removeListener('joinedRoom', this.joinedRoom);
         api.leaveRoom();
     }
 }
</script>

<style lang="sass">
 @import "variables";
 @import 'mixin';
</style>
