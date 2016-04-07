<template>
    <header id="header">
        <div class="container">
            <span id="brand">Ricoshot Robots</span>
        </div>
    </header>
</template>

<script>
 export default {
     name: 'HeaderPartial'
 }
</script>

<style lang="sass">
 @import "variables";
 @import 'mixin';
 
 #header {
     line-height:54px;
     height:54px;
     background:$primary;
     color:white;
     box-shadow:0 2px 5px rgba(0,0,0,.25);
     font-size:1rem;
     .container {
         width:1000px;
         margin:0 auto;
         padding:0 12px;
         @include respond-to(small-medium) {
             width:100%;
         }
     }
 }
 #brand {
     font-size:1.1em;
     font-weight:700;
 }
</style>
