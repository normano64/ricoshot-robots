<template>
    <svg class="icon wall" :style="{ left: tile.x * 32 + 3 + 'px', top: tile.y * 32 + 3 + 'px', transform: 'rotate(' + rotation + 'deg)' }">
        <use :xlink:href="'/static/sprite.svg#icon-' + icon"/>
    </svg>
</template>

<script>
 import store from '../../store';

 export default {
     name: 'wallPartial',
     props: ['tile'],
     data() {
         return {
             icon: this.selectWall(),
             rotation: this.rotateWall()
         }
     },
     methods: {
         selectWall() {
             if(this.tile.walls.length == 2) {
                 return 'wall-dual';
             } else {
                 return 'wall-single';
             }
         },
         rotateWall() {
             if(this.tile.walls.length == 1) {
                 if(this.tile.walls[0] == 'top') {
                     return 0;
                 } else if(this.tile.walls[0] == 'right') {
                     return 90;
                 } else if(this.tile.walls[0] == 'bottom') {
                     return 180;
                 } else if(this.tile.walls[0] == 'left') {
                     return 270;
                 }
             } else {
                 if(this.tile.walls.indexOf('top') > -1) {
                     if(this.tile.walls.indexOf('left') > -1) {
                         return 0;
                     } else {
                         return 90;
                     }
                 } else {
                     if(this.tile.walls.indexOf('left') > -1) {
                         return 270;
                     } else {
                         return 180;
                     }
                 }
             }
         }
     }
 }
</script>

<style lang="sass">
 @import "variables";
 @import 'mixin';

 .icon.wall {
     position:absolute;
     width:38px;
     height:38px;
     margin:-3px 0 0 -3px;
     fill:#757575;
 }
</style>
