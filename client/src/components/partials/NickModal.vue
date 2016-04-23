<template>
    <div class="modal">
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
 
 .modal {
     position:fixed;
     max-width:300px;
     width:100%;
     margin:0 auto;
     left:0;
     right:0;
     padding:12px 18px;
     top:120px;
     background:white;
     box-shadow:0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
     z-index:100;
     h2 {
         text-align:center;
     }
     input[type=button] {
         width:calc(50% - 6px);
         float:left;
         margin-right:6px;
         background:$gray;
     }
     input[type=submit] {
         width:calc(50% - 6px);
         float:left;
         margin-left:6px;
     }
     &.top-transition {
         transition:all .3s ease;
         transform:translateY(0px);
         opacity:1;
     }
     &.top-enter, &.top-leave {
         transform:translateY(-200px);
         opacity:0;
     }
 }
</style>
