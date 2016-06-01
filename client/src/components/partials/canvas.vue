<template>
		<canvas v-el:canvas height="518" width="518">
		
		</canvas>
</template>

<script>
 import store from '../../store';

 export default {
     name: 'canvasPartial',
		 props: ["walls", "goals", "robots"],
		 data() {
				 return {
						 robotsImage: null,
						 ctx: null
				 }
		 },
		 methods: {
				 reDraw() {
						 this.robots.forEach(function(robot) {
								 console.log("/static/images/robot_" + robot.color + ".png 1");
								 
								 var imageObj = new Image();

								 var self = this;
								 imageObj.onload = function() {
										 self.ctx.drawImage(imageObj, (robot.x*32)+7, (robot.y*32)-4, 24, 32);
								 }

								 imageObj.src = "/static/images/robot_" + robot.color + ".png";
						 }, this);
				 },
				 drawWalls() {
						 var self = this;
						 
						 var backObj = new Image();

						 backObj.onload = function() {
								 self.ctx.drawImage(backObj, 0, 0, 518, 518);
						 }

						 backObj.src = "/static/images/map.png";
						 
						 this.walls.forEach(function(wall) {


								 wall.walls.forEach(function(i) {
										 var imageObj = new Image();
										 
										 imageObj.onload = function() {
												 self.ctx.drawImage(imageObj, (wall.x*32), (wall.y*32), 38, 38);
										 }

										 imageObj.src = "/static/images/wall_" + i + ".png";
								 });
								 
						 }, this);
				 }
		 },
		 attached() {
				 this.ctx = this.$els.canvas.getContext("2d");

				 store.event.on('re_draw', this.reDraw);
				 store.event.on('drawWalls', this.drawWalls);
				 
		 },
		 dettached() {
				 store.removeListener('drawWalls', this.drawWalls);
		 }
 }
 
</script>

<style lang="sass">
 @import "variables"; /* färger */
 @import 'mixin'; /* funktioner */

 canvas {
		 height: 518px;
		 width: 518px;
 }
</style>
