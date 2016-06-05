<template>
    <canvas v-el:canvas height="518" width="518"></canvas>
    <robot-partial v-for="robot in robots" :robot="robot" @click="markRobot(robot.color)" :class="{ marked: markedRobot == robot.color }" :marked="markedRobot == robot.color"></robot-partial>
    <img id="current" :src="'/static/images/' + currentGoal.sign + '_' + currentGoal.color + '.png'" v-if="currentGoal">
    <div id="controls">
        <div @click="move('left')"><svg class="icon"><use xlink:href="/static/sprite.svg#icon-arrow-left"/></svg></div>
        <div @click="move('up')"><svg class="icon"><use xlink:href="/static/sprite.svg#icon-arrow-up"/></svg></div>
        <div @click="move('down')"><svg class="icon"><use xlink:href="/static/sprite.svg#icon-arrow-down"/></svg></div>
        <div @click="move('right')"><svg class="icon"><use xlink:href="/static/sprite.svg#icon-arrow-right"/></svg></div>
    </div>
</template>

<script>
    import store from '../../store';
    import _ from 'lodash';
    import robotPartial from './robot.vue';

    export default {
        name: 'canvasPartial',
        props: ["walls", "goals", "robots", "board", "currentGoal"],
        components: {
            robotPartial
        },
        data() {
            return {
                ctxRobots: null,
                markedRobot: null,
                moveQueue: [],
                steps: 0
            }
        },
        watch: {
            walls: 'drawWalls',
            goals: 'drawGoals'
        },
        methods: {
            drawWalls() {
                var self = this;

                this.walls.forEach(function(wall) {
                    wall.walls.forEach(function(i) {
                        var imageObj = new Image();

                        imageObj.onload = function() {
                            self.ctxStatic.drawImage(imageObj, (wall.x*32), (wall.y*32), 38, 38);
                        }

                        imageObj.src = "/static/images/wall_" + i + ".png";
                    });
                });
            },
            drawGoals() {
                var self = this;

                this.goals.forEach(function(goal) {
                    var goalObj = new Image();
                    goalObj.onload = function() {
                        self.ctxStatic.drawImage(goalObj, (goal.x*32)+7, (goal.y*32)+7, 24, 24);
                    }
                    goalObj.src = "/static/images/" + goal.sign + "_" + goal.color + ".png";
                });
            },
            markRobot(robot) {
                if(this.markedRobot == robot) {
                    this.markedRobot = null;
                } else {
                    this.markedRobot = robot
                }
            },
            move(direction) {
                if(this.markedRobot != null) {
		            var i = 0;

		            var robot = _.find(this.robots, { color: this.markedRobot });

		            if(direction == 'up') {
				        while(this.board[robot.x][robot.y-i].top == true) {
					        if((robot.y - i > 0) && !(this.robotInPlace(robot.x, robot.y - i - 1))) {
							    i++;
					        } else {
                                break;
                            }
				        }
				        if(i != 0) {
					        robot.y -= i;
					        this.moveQueue.push({ robot: this.markedRobot, movement: 'up' });
				        }
		            } else if(direction == 'down') {
				        while(this.board[robot.x][robot.y+i].bottom == true) {
					        if((robot.y + i < this.board.length - 1) && !(this.robotInPlace(robot.x, robot.y + i + 1))) {
							    i++;
					        } else {
                                break;
                            }
				        }
				        if(i != 0) {
					        robot.y += i;
					        this.moveQueue.push({ robot: this.markedRobot, movement: 'down' });
				        }
		            } else if(direction == 'left') {
				        while(this.board[robot.x-i][robot.y].left == true) {
					        if((robot.x - i > 0) && !(this.robotInPlace(robot.x - i - 1, robot.y))) {
							    i++;
					        } else {
                                break;
                            }
				        }
				        if(i != 0) {
					        robot.x -= i;
					        this.moveQueue.push({ robot: this.markedRobot, movement: 'left' });
				        }
		            } else if(direction == 'right') {
				        while(this.board[robot.x+i][robot.y].right == true) {
					        if((robot.x + i < this.board.length - 1) && !(this.robotInPlace(robot.x + i + 1, robot.y))) {
							    i++;
					        } else {
                                break;
                            }
				        }
				        if(i != 0) {
					        robot.x += i;
					        this.moveQueue.push({ robot: this.markedRobot, movement: 'right' });
				        }
		            }
                    if(i != 0) {
                        this.steps += 1;
					    if(this.checkGoal(robot)) {
                            console.log("woop");
                            this.markedRobot = null;
                            store.event.emit('show_submit', this.moveQueue);
                            store.emit('reached_goal', this.moveQueue);
                        }
                    }
                }
            },
            robotInPlace(x, y) {
                function checkTile(robot) {
                    if(robot.color != this.markedRobot) {
                        if(robot.x == x && robot.y == y) {
                            return true;
                        }
                    }
                    return false;
                }
                return this.robots.some(checkTile, this);
            },
            checkGoal(robot) {
		        if(this.currentGoal.color != "multi") {
				    if(robot.color == this.currentGoal.color) {
						if(robot.x == this.currentGoal.x && robot.y == this.currentGoal.y) {
                            return true;
                        }
				    }
		        } else {
				    if(robot.x == this.currentGoal.x && robot.y == this.currentGoal.y) {
                        return true;
                    }
		        }
                return false;
            }
        },
        attached() {
            this.ctxStatic = this.$els.canvas.getContext("2d");
            var backObj = new Image();

            var self = this;
            backObj.onload = function() {
                self.ctxStatic.drawImage(backObj, 0, 0, 518, 518);
            }

            backObj.src = "/static/images/map.png";
        },
    }
</script>

<style lang="sass">
    @import "variables"; /* färger */
    @import 'mixin'; /* funktioner */

    canvas {
        height: 518px;
        width: 518px;
    }
    #current {
        position:absolute;
        top:235px;
        left:235px;
    }
    #controls {
        display:flex;
        height:40px;
        div {
            flex:1;
            background:$gray;
            text-align:center;
            cursor:pointer;
            &:hover {
                background:$gray-dark;
            }
        }
        svg.icon {
            fill:white;
            width:24px;
            height:24px;
            margin:8px 0;
        }
    }
</style>
