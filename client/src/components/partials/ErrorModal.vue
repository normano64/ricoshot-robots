<template>
    <div class="modal">
        <h2>{{ message }}</h2>
    </header>
</template>

<script>
 export default {
     name: 'ErrorModalPartial',
     props: ['message']
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
