<template>
    <div class="avatar" :style="{ 'background-color': color, 'color': textColor }">
        <span>{{ nick | first | capitalize }}</span>
        <span class="full" v-if="full">{{ nick }}</span>
    </div>
</template>

<script>
 export default {
     name: 'AvatarPartial',
     props: ['nick', 'full'],
     filters: {
         first(text) {
             return text.substr(0, 1);
         }
     },
     computed: {
         color() {
             return this.$options.filters.textToColor(this.nick);
         },
         textColor() {
             var lightness = this.$options.filters.colorLightness(this.color);
             if(lightness >= 0.5) {
                 return '#000000';
             } else {
                 return '#ffffff';
             }
         }
     }
 }
</script>

<style lang="sass">
 @import "variables";
 @import 'mixin';

 .avatar {
     cursor:default;
     font-size:1.1em;
     height:32px;
     width:32px;
     line-height:32px;
     text-align:center;
     border-radius:16px;
     color:white;
     margin:0 8px 0 0;
     user-select:none;
     position:relative;
     .full {
         transition:opacity .3s ease;
         pointer-events:none;
         position:absolute;
         opacity:0;
         left:0;
         background:$gray;
         border-radius:16px;
         padding:0 12px;
         z-index:97;
     }
     &:hover {
         .full {
             pointer-events:auto;
             opacity:1,
         }
     }
 }
</style>
