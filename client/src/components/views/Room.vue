<template>
    <div></div>
</template>

<script>
 import _ from 'lodash';
 import api from '../../api.js';

 export default {
     name: 'RoomView',
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
