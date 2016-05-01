<template>
    <div>
        <h2>Change nickname</h2>
        <form @submit.prevent="changeNick">
            <input type="text" v-model="nick" v-el:nick placeholder="Nickname" @keyup.esc="$dispatch('hideNickModal')"/>
            <div v-if="nickError" class="error">{{ nickError }}</div>
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
             nick: null,
             nickError: null
         }
     },
     methods: {
         changeNick() {
             store.emit('set_nick', this.nick);
         },
         newNick(nick) {
             this.$dispatch('hideNickModal');
         },
         nickModalError(error) {
             this.nickError = error;
         }
     },
     created() {
         store.on('new_nick', this.newNick);
         store.on('nick_modal_error', this.nickModalError);
     },
     destroyed () {
         store.removeListener('new_nick', this.newNick);
         store.removeListener('nick_modal_error', this.nickModalError);
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
