<template>
    <div>
        <h2>Change nickname</h2>
        <form @submit.prevent="changeNick">
            <input type="text" v-model="nick" v-el:nick placeholder="Nickname" @keyup.esc="$dispatch('hideNickModal')"/>
            <input type="button" value="Cancel" @click="$dispatch('hideNickModal')"/>
            <input type="submit" value="DO IT NOW!"/>
        </form>
    </header>
</template>

<script>
 import api from '../../api.js';
 
 export default {
     name: 'NickModalPartial',
     data() {
         return {
             nick: ''
         }
     },
     methods: {
         changeNick() {
             api.setNick(this.nick);
         },
         newNick(nick) {
             this.$dispatch('hideNickModal');
         }
     },
     created() {
         api.on('newNick', this.newNick);
     },
     destroyed () {
         api.removeListener('newNick', this.newNick);
     },
     attached() {
         this.$els.nick.focus();
     }
 }
</script>

<style lang="sass">
 @import "variables";
 @import 'mixin';
</style>
