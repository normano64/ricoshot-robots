<template>
    <div>
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
</style>
