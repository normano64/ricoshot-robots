<template>
    <header-partial></header-partial>
    <div id="main">
        <router-view></router-view>
    </div>
    <nick-modal-partial v-if="nickModal" transition="top"></nick-modal-partial>
    <error-modal-partial v-if="errorModal" transition="top" :message="errorMessage"></error-modal-partial>
    <overlay-partial v-if="overlay" transition="opacity" :click-listener="overlayClickListener"></overlay-partial>
</template>

<script>
 import api from './api.js';
 import HeaderPartial from './components/partials/Header.vue';
 import NickModalPartial from './components/partials/NickModal.vue';
 import ErrorModalPartial from './components/partials/ErrorModal.vue';
 import OverlayPartial from './components/partials/Overlay.vue';
 
 export default {
     name: 'App',
     components: {
         HeaderPartial,
         NickModalPartial,
         ErrorModalPartial,
         OverlayPartial
     },
     data() {
         return {
             nickModal: false,
             errorModal: false,
             errorMessage: '',
             overlay: false,
             overlayClickListener: false
         }
     },
     events: {
         showNickModal: 'showNickModal',
         hideNickModal: 'hideNickModal',
         hideOverlay: 'hideOverlay'
     },
     methods: {
         goRoom(uuid) {
             if(uuid != 'home') {
                 this.$router.go('/room/' + uuid);
             } else {
                 this.$router.go('/');
             }
         },
         changeTitle(title) {
             if(title) {
                 document.title = 'Ricoshot Robots ' + title;
             } else {
                 document.title = 'Ricoshot Robots';
             }
         },
         showNickModal() {
             this.nickModal = true;
             this.overlayClickListener = true;
             this.overlay = true;
         },
         hideNickModal() {
             this.nickModal = false;
             this.overlay = false;
         },
         hideOverlay() {
             this.nickModal = false;
             this.errorModal = false;
             this.overlay = false;
         },
         showErrorModal(message) {
             this.nickModal = false;
             this.errorModal = true;
             this.errorMessage = message;
             this.overlayClickListener = false;
             this.overlay = true;
         }
     },
     created() {
         api.on('goRoom', this.goRoom);
         api.on('connected', this.hideOverlay);
         api.on('notConnected', this.showErrorModal);
     },
     destoryed() {
         api.removeListener('goRoom', this.goRoom);
         api.removeListener('connected', this.hideOverlay);
         api.removeListener('notConnected', this.showErrorModal);
         api.disconnect();
     }
 }
</script>

<style lang="sass">
 @import 'variables';
 @import 'mixin';
 @import 'base';

 #main {
     width:1000px;
     margin:12px auto;
     font-size:.9rem;
     color:$gray-dark;
     display:block;
     box-shadow:0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
     background:white;
     &:after {
         content:'';
         display:block;
         clear:both;
     }
     @include respond-to(small-medium) {
         width:100%;
         margin:0;
     }
 }
</style>
