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
             document.title = title+'| Ricoshot Robots';
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
     margin:0 auto;
     font-size:.9rem;
     padding:12px;
     color:$gray-dark;
     display:block;
     @include respond-to(small-medium) {
         width:100%;
     }
 }
</style>
