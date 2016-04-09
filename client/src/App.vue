<template>
    <header-partial></header-partial>
    <div id="main">
        <router-view keep-alive></router-view>
    </div>
</template>

<script>
 import HeaderPartial from './components/partials/Header.vue';
 
 export default {
     name: 'App',
     components: {
         HeaderPartial
     },
     events: {
         changeTitle (title) {
             document.title = title+' | Ricoshot Robots';
             return true;
         }
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
