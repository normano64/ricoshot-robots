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
 import store from '../../store';
 
 export default {
     name: 'nickModalPartial',
     data() {
         return {
             nick: null
         }
     },
     methods: {
         changeNick() {
             store.emit('set_nick', this.nick);
         },
         newNick(nick) {
             this.$dispatch('hideNickModal');
         }
     },
     created() {
         store.on('new_nick', this.newNick);
     },
     destroyed () {
         store.removeListener('new_nick', this.newNick);
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
