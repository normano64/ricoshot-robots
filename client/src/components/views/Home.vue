<template>
        {{Message}}
</template>

<script>
 export default {
     name: 'HomeView',
     data () {
         return {
             Message: 'Home'
         }
     },
     attached () {
         this.$dispatch('changeTitle', 'Home');
     }
 }
</script>

<style lang="sass">
 @import "variables";
 @import 'mixin';
 
</style>
