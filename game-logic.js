var redo = [];
var moves = [];
var step = 0;
var gamePad = [[]];
var goals = [];
var goal = null;
var activeRobot = null;
var robots = [{color: "red", placement: {x: null, y: null}}, 
							{color: "blue", placement: {x: null, y: null}},
							{color: "green", placement: {x: null, y: null}},
							{color: "yellow", placement: {x: null, y: null}}];

var goalsAndWalls = [
		{
				goals: [
						[ {color: "red", sign: "star", placement: {x: 2, y: 5}}, {color: "yellow", sign: "cogwheel", placement: {x: 1, y: 3}}, {color: "blue", sign: "moon", placement: {x: 6, y: 1}},
							{color: "green", sign: "planet", placement: {x: 5, y: 4}}, {color: "multi", sign: "whirlwind", placement: {x: 7, y: 5}}],
						[ {color: "red", sign: "star", placement: {x: 2, y: 1}}, {color: "yellow", sign: "cogwheel", placement: {x: 6, y: 4}},
							{color: "blue", sign: "moon", placement: {x: 5, y: 6}}, {color: "green", sign: "planet", placement: {x: 1, y: 3}}, {color: "multi", sign: "whirlwind", placement: {x: 3, y: 7}}]],
				walls: [
						[ { placement: {x: 1, y: 3}, wall: ["top", "right"], p: 0}, { placement: {x: 2, y: 5}, wall: ["bottom", "right"]}, { placement: {x: 6, y: 1}, wall: ["bottom", "left"]},
							{ placement: {x: 5, y: 4}, wall: ["top", "left"]}, { placement: {x: 7, y: 5}, wall: ["bottom", "right"]}, { placement: {x: 7, y: 7}, wall: ["top", "left"]},
							{ placement: {x: 3, y: 0}, wall: ["right"]}, { placement: {x: 0, y: 7}, wall: ["top"]}
						], []
				]},
		{ 
				goals: [
						[ {color: "red", sign: "moon", placement: {x: 4, y: 1}}, {color: "green", sign: "cogwheel", placement: {x: 1, y: 2}},
							{color: "blue", sign: "planet", placement: {x: 3, y: 6}}, {color: "yellow", sign: "star", placement: {x: 6, y: 3}}],
						
						[ {color: "red", sign: "moon", placement: {x: 3, y: 6}}, {color: "green", sign: "cogwheel", placement: {x: 1, y: 2}},
							{color: "blue", sign: "planet", placement: {x: 6, y: 5}}, {color: "yellow", sign: "star", placement: {x: 6, y: 1}}]],
				walls: [
					[ { placement: {x: 3, y: 6}, wall: ["bottom", "left"], p: 1}, { placement: {x: 6, y: 2}, wall: ["bottom", "right"]}, { placement: {x: 4, y: 1}, wall: ["top", "left"]},
							{ placement: {x: 1, y: 2}, wall: ["top", "right"]}, { placement: {x: 7, y: 7}, wall: ["top", "left"]}, { placement: {x: 1, y: 0}, wall: ["right"]},
							{ placement: {x: 0, y: 5}, wall: ["bottom"]}
						], []
				]},
		{
				goals: [
						[ {color: "red", sign: "cogwheel", placement: {x: 1, y: 1}}, {color: "blue", sign: "star", placement: {x: 2, y: 4}},
							{color: "green", sign: "moon", placement: {x: 6, y: 2}}, {color: "yellow", sign: "planet", placement: {x: 7, y: 5}}],
						
						[ {color: "red", sign: "cogwheel", placement: {x: 7, y: 5}}, {color: "blue", sign: "star", placement: {x: 5, y: 2}},
							{color: "green", sign: "moon", placement: {x: 2, y: 4}}, {color: "yellow", sign: "planet", placement: {x: 1, y: 6}}]],
				walls: [
					[ { placement: {x: 2, y: 4}, wall: ["bottom", "right"], p: 2}, { placement: {x: 1, y: 1}, wall: ["bottom", "left"]}, { placement: {x: 6, y: 2}, wall: ["top", "right"]},
							{ placement: {x: 7, y: 5}, wall: ["top", "left"]}, { placement: {x: 7, y: 7}, wall: ["top", "left"]}, { placement: {x: 3, y: 0}, wall: ["right"]},
							{ placement: {x: 0, y: 6}, wall: ["top"]}
						], []
				]},
		{ 
				goals: [
					[ {color: "red", sign: "planet", placement: {x: 4, y: 5}}, {color: "blue", sign: "cogwheel", placement: {x: 6, y: 3}},
						{color: "green", sign: "star", placement: {x: 1, y: 6}}, {color: "yellow", sign: "moon", placement: {x: 7, y: 3}}],
						
					[ {color: "red", sign: "planet", placement: {x: 1, y: 2}}, {color: "blue", sign: "cogwheel", placement: {x: 2, y: 6}},
						{color: "green", sign: "star", placement: {x: 5, y: 1}}, {color: "yellow", sign: "moon", placement: {x: 6, y: 4}}]],
				walls: [
					[ { placement: {x: 6, y: 3}, wall: ["bottom", "left"], p: 3}, { placement: {x: 4, y: 5}, wall: ["top", "right"]}, { placement: {x: 2, y: 1}, wall: ["top", "left"]},
							{ placement: {x: 1, y: 6}, wall: ["bottom", "right"]}, { placement: {x: 7, y: 7}, wall: ["top", "left"]}, { placement: {x: 4, y: 0}, wall: ["right"]},
							{ placement: {x: 0, y: 4}, wall: ["top"]}
						], []
				]}];

// export default goalsAndWalls;

// BYGGER ALLA VÄGGAR PÅ SPELPLANEN
function createWalls(gamepad, walls) {

    walls.forEach(function(wall) {
		if (wall == "top") {
			gamepad[wall.x][wall.y].top = false;
			gamepad[wall.x][wall.y-1].bottom = false;
		}
		if (wall == "bottom") {
			gamepad[wall.x][wall.y].bottom = false;
			gamepad[wall.x][wall.y+1].top = false;
		}
		if (wall == "right") {
			gamepad[wall.x][wall.y].right = false;
			gamepad[wall.x+1][wall.y].left = false;
		}
		if (wall == "left") {
			gamepad[wall.x][wall.y].left = false;
			gamepad[wall.x-1][wall.y].right = false;
		}
	});

		return gamepad;
}

// BYGGER UPP GRUNDEN MED YTTERVÄGGAR
function makePad() {
		var n = 16;

		for (var i = 0; i < n; i++) {
				gamePad[i] = [];

				for (var j = 0; j < n; j++) {
					gamePad[i][j] = {
                        top: true,
                        right: true,
                        bottom: true,
                        left: true,
                        robot: false
                    };

						if (i == 0)  gamePad[i][j].left = false;
						if (i == 15) gamePad[i][j].right = false;
						if (j == 0)  gamePad[i][j].top = false;
						if (j == 15) gamePad[i][j].bottom = false;
				}
		}
		
		return gamePad;
}

// VRIDER VÄGGARNA
function twistWalls(pads) {
    var rotatedWalls = [];
    pads.forEach(function(pad, index) {
        if(index == 1) {
            pad.forEach(function(tile) {
                var walls = [];
                tile.wall.forEach(function(wall) {
                    switch(wall) {
                        case "top":
                            walls.push("right");
                            break;
                        case "right":
                            walls.push("bottom");
                            break;
                        case "bottom":
                            walls.push("left");
                            break;
                        case "left":
                            walls.push("top");
                            break;
                    }
                });
                rotatedWalls.push({
                    x: 15 - tile.placement.y,
                    y: tile.placement.x,
                    walls: walls
                });
            });
        } else if(index == 2) {
            pad.forEach(function(tile) {
                var walls = [];
                tile.wall.forEach(function(wall) {
                    switch(wall) {
                        case "top":
                            walls.push("bottom");
                            break;
                        case "right":
                            walls.push("left");
                            break;
                        case "bottom":
                            walls.push("top");
                            break;
                        case "left":
                            walls.push("right");
                            break;
                    }
                });
                rotatedWalls.push({
                    x: 15 - tile.placement.x,
                    y: 15 - tile.placement.y,
                    walls: walls
                });
            });
        } else if(index == 3) {
            pad.forEach(function(tile) {
                var walls = [];
                tile.wall.forEach(function(wall) {
                    switch(wall) {
                        case "top":
                            walls.push("left");
                            break;
                        case "right":
                            walls.push("top");
                            break;
                        case "bottom":
                            walls.push("right");
                            break;
                        case "left":
                            walls.push("bottom");
                            break;
                    }
                });
                rotatedWalls.push({
                    x: tile.placement.y,
                    y: 15 - tile.placement.x,
                    walls: walls
                });
            });
        } else {
            pad.forEach(function(tile) {
                console.log(tile);
                rotatedWalls.push({
                    x: tile.placement.x,
                    y: tile.placement.y,
                    walls: tile.wall
                });
            });
        }
    });
	return rotatedWalls;
}

// VRIDER MÅLEN
function twistGoals(goals) {
		
		for (var i = 0; i < goals[1].length; i++) {
				tmpy = goals[1][i].placement.y;
				goals[1][i].placement.y = goals[1][i].placement.x;
				goals[1][i].placement.x = 15 - tmpy;
		}

		for (var i = 0; i < goals[2].length; i++) {
				tmpx = goals[2][i].placement.x;
				goals[2][i].placement.x = goals[2][i].placement.y;
				goals[2][i].placement.y = 15 - tmpx;
		}

		for (var i = 0; i < goals[3].length; i++) {
				tmpy = goals[3][i].placement.x;
				tmpx = goals[3][i].placement.y;
				goals[3][i].placement.x = 15 - tmpy;
				goals[3][i].placement.y = 15 - tmpx;
		}

		return goals[0].concat(goals[1], goals[2], goals[3]);
}

// PLACERAR UT ROBOTORNA 
module.exports.placeRobots = function placeRobots() {
    var robots = [
        { color: "red", x: null, y: null },
		{ color: "blue", x: null, y: null },
		{ color: "green", x: null, y: null },
		{ color: "yellow", x: null, y: null }];

	for(var i = 0; i < robots.length; i++) {
        while(true) {
			var tmpx = Math.floor(Math.random() * 16);
			var tmpy = Math.floor(Math.random() * 16);
            var placed = true;

			if (!(tmpx == 7 && tmpy == 7) || !(tmpx == 8 && tmpy == 7) ||
				!(tmpx == 7 && tmpy == 8) || !(tmpx == 8 && tmpy == 8)) {
                    robots.forEach(function(robot) {
                        if(robot.x == tmpx && robot.y == tmpy) {
                            placed = false;
                        }
                    });
				    if(placed) {
					    robots[i].x = tmpx;
					    robots[i].y = tmpy;
                        break;
				    }
			}
        }
	}
	return robots;
}

// SKAPAR SPELPLANEN
module.exports.generateMap = function generateMap() {
	var gamePads = [0, 1, 2, 3];
	var gameGoals = [];
	var gameWalls = [];
	var gameBoard = makePad();
	
	while (gamePads.length != 0) {
		var nr = Math.floor(Math.random()*gamePads.length);
		var tmpGoalsAndWalls = goalsAndWalls[gamePads[nr]];

		gameGoals = gameGoals.concat([tmpGoalsAndWalls.goals[0]]);
		gameWalls = gameWalls.concat([tmpGoalsAndWalls.walls[0]]);

		var rm = gamePads.splice(nr, 1);
	}

	gameGoals = twistGoals(gameGoals);
	gameWalls = twistWalls(gameWalls);

	// ANROPAR createWalls SOM SKAPAR ALLA VÄGGAR PÅ SPELPLANEN
	for (var i = 0; i < gameWalls.length; i++) {
        gameBoard = createWalls(gameBoard, gameWalls);
    }

	return { goals: gameGoals, walls: gameWalls };
}

// VÄLJER VILKET MÅL SOM KOMMER HÄR NÄST
function chooseGoal() {
		console.log("STEPS: " + step);
		steps = 0;
		var gnr = Math.floor(Math.random()*goals.length);
		goal = goals[gnr];
		goals.splice(gnr, 1);
		console.log("Goal: " + goal.color + " " + goal.sign +
								" at x: " + goal.placement.x + " y: "+ goal.placement.y);
}


// KOLLAR OM ROBOTEN ÄR I DET RÄTTA MÅLET
function checkGoal() {
		if (goal.color != "multi") {
				console.log("Robot: " + activeRobot.color);
				console.log("Goal: " + JSON.stringify(goal));
				if (activeRobot.color == goal.color) {
						if (activeRobot.placement.x == goal.placement.x &&
								activeRobot.placement.y == goal.placement.y) { moves = []; chooseGoal();}
				}
		} else {
				if (activeRobot.placement.x == goal.placement.x &&
						activeRobot.placement.y == goal.placement.y) { moves = []; chooseGoal();}
		}
}

// UNDO FUNKTION
function undo() {
		var thisMove = moves.pop();
		redo.push(thisMove);
		move(gameplan, thisMove.e, thisMove.robot);
		
		redo.push(thisMove);
		if ( moves.length == 0) { /* UNDO BUTTON SKA GÖMMAS */} 
		// REDO BUTTON SKA VISAS
}

// REDO FUNKTION
function redo() {
		var thisMove = redo.pop();
		
		moves.push(thisMove);
		if ( redo.length == 0) { /* REDO BUTTON SKA GÖMMAS */} 
		// UNDO BUTTON SKA VISAS
}

// gamePad = primGame();
//gamePad = game();

function move(gameplan, e, robot) {
		var i = 0;

		// robot = activeRobot;
		
		if ( e == '38' ) { // up arrow
				while (gameplan[robot.x][robot.y-i].top == true) {
							if ((robot.y - i) > 0 &&
									gameplan[robot.x][robot.y-(i+1)].robot == false) {
									i++;
							} else { break;}
				}
				if (i != 0) {				
						gameplan[robot.x][robot.y].robot = false;
						gameplan[robot.x][robot.y-i].robot = true;
						robot.y -= i;
						step += 1;
						checkGoal();
						moves.push({robot: activeRobot, movement: '40'});
				}
				
		} else if ( e == '40' ) { // down arrow
				while ( gameplan[robot.x][robot.y+i].bottom == true) {
						if ((robot.y + i) < (gameplan.length-1) &&
								gameplan[robot.x][robot.y+(i+1)].robot == false) {
								i++;
						} else { break;}
				}
				if (i != 0) {
						gameplan[robot.x][robot.y].robot = false;
						gameplan[robot.x][robot.y+i].robot = true;
						robot.y += i;
						step += 1;
						checkGoal();
						moves.push({robot: activeRobot, movement: '38'});
				}
				
		} else if ( e == '37') { // left arrow
				while ( gameplan[robot.x-i][robot.y].left == true) {
						if ((robot.x - i) > 0 &&
								gameplan[robot.x-(i+1)][robot.y].robot == false) {
								i++;
						} else { break;}
				}
				if (i != 0) {
						gameplan[robot.x][robot.y].robot = false;
						gameplan[robot.x-i][robot.y].robot = true;
						robot.x -= i;
						step += 1;
						checkGoal();
						moves.push({robot: activeRobot, movement: '39'});
				}

		} else if ( e == '39') { // right arrow
				while ( gameplan[robot.x+i][robot.y].right == true) {
						if ((robot.x + i) < (gameplan.length-1) &&
								gameplan[robot.x+(i+1)][robot.y].robot == false) {
								i++;
						} else { break;}
				}

				if (i != 0) {
						gameplan[robot.x][robot.y].robot = false;
						gameplan[robot.x+i][robot.y].robot = true;
						robot.x += i;
						step += 1;
						checkGoal();
						moves.push({robot: activeRobot, movement: '37'});
				}
		}
		
		console.log("Robot: " + JSON.stringify(robot));
		console.log("Robots: " + JSON.stringify(robots));
}

function checkKey(e) {
		e = e || window.event;

		// console.log(e);
		
		if (e.keyCode >= '37' && e.keyCode <= '40') {
				move(gamePad,  e.keyCode, activeRobot);
		} else if (e.keyCode >= '49' && e.keyCode <= '52') {
				if (e.keyCode =='49') { // red robot
						activeRobot = robots[0];
						console.log("Active robot is red");
						console.log(JSON.stringify(robots[0]));
				} else if (e.keyCode == '50') { // blue robot
						activeRobot = robots[1];
						console.log("Active robot is blue");
						console.log(JSON.stringify(robots[1]));
				} else if (e.keyCode == '51') { // green robot
						activeRobot = robots[2];
						console.log("Active robot is green");
						console.log(JSON.stringify(robots[2]));
				} else if (e.keyCode == '52') { // yellow robot
						activeRobot = robots[3];
						console.log("Active robot is yellow");
						console.log(JSON.stringify(robots[3]));
				}
		}
}
