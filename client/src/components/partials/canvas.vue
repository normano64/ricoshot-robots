<template>
    <canvas v-el:canvas height="518" width="518"></canvas>
    <robot-partial v-for="robot in robots" :robot="robot" @click="markRobot(robot.color)" :class="{ marked: markedRobot == robot.color }"></robot-partial>
    <img src="/static/images/robot_marked.png" alt="marked" v-if="markedRobot" class="marker" :style="markerPosition()"/>
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
        props: ["walls", "goals", "robots", "board"],
        components: {
            robotPartial
        },
        data() {
            return {
                ctxRobots: null,
                markedRobot: null,
                moveQueue: []
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
                console.log(this.board);
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
            markerPosition() {
                if(this.markedRobot != null) {
                var robot = _.find(this.robots, { color: this.markedRobot });
                    return { left: (robot.x*32)+5 + 'px', top: (robot.y*32)-6 + 'px' };
                } else {
                    return {};
                }
            },
            move(direction) {
                if(this.markedRobot != null) {
		            var i = 0;

		            var robotIndex = _.findIndex(this.robots, { color: this.markedRobot });
                    console.log(robotIndex, direction, this.board);
                    var robot = this.robots[robotIndex];

		            if(direction == 'up') {
				        while(this.board[robot.x][robot.y-i].top == true) {
					        if((robot.y - i) > 0) {
							    i++;
					        } else {
                                break;
                            }
				        }
				        if(i != 0) {
					        this.board[robot.x][robot.y].robot = false;
					        this.board[robot.x][robot.y-i].robot = true;
					        robot.y -= i;
					        step += 1;
					        checkGoal();
					        this.moveQueue.push({robot: activeRobot, movement: '40'});
				        }

		            } else if(direction == 'down') {
				        while(this.board[robot.x][robot.y+i].bottom == true) {
					        if((robot.y + i) < (this.board.length-1)) {
							    i++;
					        } else {
                                break;
                            }
				        }
				        if(i != 0) {
					        this.board[robot.x][robot.y].robot = false;
					        this.board[robot.x][robot.y+i].robot = true;
					        robot.y += i;
					        step += 1;
					        checkGoal();
					        this.moveQueue.push({robot: activeRobot, movement: '38'});
				        }
 
		            } else if(direction == 'left') {
				        while(this.board[robot.x-i][robot.y].left == true) {
                            console.log(this.board[robot.x-i][robot.y].left);
					        if((robot.x - i) > 0) {
							    i++;
					        } else {
                                break;
                            }
				        }
                        console.log(i);
				        if(i != 0) {
					        this.board[robot.x][robot.y].robot = false;
					        this.board[robot.x-i][robot.y].robot = true;
					        robot.x -= i;
					        step += 1;
					        checkGoal();
					        this.moveQueue.push({robot: activeRobot, movement: '39'});
				        }
		            } else if(direction == 'right') {
				        while(this.board[robot.x+i][robot.y].right == true) {
					        if((robot.x + i) < (this.board.length-1)) {
							    i++;
					        } else {
                                break;
                            }
				        }

				        if (i != 0) {
					        this.board[robot.x][robot.y].robot = false;
					        this.board[robot.x+i][robot.y].robot = true;
					        robot.x += i;
					        step += 1;
					        checkGoal();
					        this.moveQueue.push({robot: activeRobot, movement: '37'});
				        }
		            }
                }
                console.log(this.moveQueue);
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
    .marker {
        position:absolute;
        width:28px;
        height:35px;
        z-index:1;
        /* transition:all .3s ease; */
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
