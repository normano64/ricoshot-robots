<template>
    <div id="overlay" @click.prevent="hideOverlay"></div>
</template>

<script>
 export default {
     name: 'overlayPartial',
     props: ['clickListener'],
     methods: {
         hideOverlay() {
             if(this.clickListener) {
                 this.$dispatch('hideOverlay');
             }
         }
     }
 }
</script>

<style lang="sass">
 @import "variables";
 @import 'mixin';

 #overlay {
     position:fixed;
     display:block;
     height:120%;
     width:100%;
     top:0;
     left:0;
     background:rgba(0,0,0,.5);
     z-index:99;
     &.opacity-transition {
         transition:all .3s ease;
         opacity:1;
     }
     &.opacity-enter, &.opacity-leave {
         opacity:0;
     }
 }
</style>
