<template>
    <div id="app">
        <header-partial></header-partial>
        <div id="main">
            <router-view></router-view>
        </div>
        <nick-modal-partial class="modal" v-if="nickModal" transition="top"></nick-modal-partial>
        <error-modal-partial class="modal" v-if="errorModal" transition="top" :message="errorMessage"></error-modal-partial>
        <overlay-partial v-if="overlay" transition="opacity" :click-listener="overlayClickListener"></overlay-partial>
    </div>
</template>

<script>
 import store from '../store';
 import headerPartial from './partials/header.vue';
 import nickModalPartial from './partials/nickModal.vue';
 import errorModalPartial from './partials/errorModal.vue';
 import overlayPartial from './partials/overlay.vue';
 
 export default {
     name: 'app',
     components: {
         headerPartial,
         nickModalPartial,
         errorModalPartial,
         overlayPartial
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
         goToRoom(uuid) {
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
         showErrorModal(error) {
             this.nickModal = false;
             this.errorModal = true;
             this.errorMessage = 'The server is offline';
             this.overlayClickListener = false;
             this.overlay = true;
         }
     },
     created() {
         store.on('go_to_room', this.goToRoom);
         store.on('connect', this.hideOverlay);
         store.on('connect_error', this.showErrorModal);
     },
     destoryed() {
         store.removeListener('go_to_room', this.goToRoom);
         store.removeListener('connect', this.hideOverlay);
         store.removeListener('connect_error', this.showErrorModal);
         store.disconnect();
     }
 }
</script>

<style lang="sass">
 @import 'variables';
 @import 'mixin';
 @import 'base';

 #app {
     max-width:1000px;
     width:100%;
     margin:18px auto;
     overflow:hidden;
     box-shadow:0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
     @include respond-to(small-medium) {
         margin:0;
     }
 }
 #main {
     width:100%;
     font-size:.9rem;
     color:$gray-dark;
     display:block;
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
