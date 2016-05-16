<template>
    <div class="modal">
        <h2>{{ t('winner_is') }}</h2>
	<h3>{{ winner }}</h3>
    </header>
</template>

<script>
 export default {
     name: 'winnerPartial',
     props: ['winner'],
     methods: {
	 
     }
 }
</script>

<style lang="sass">
 @import "variables";
 @import 'mixin';
 
</style>
