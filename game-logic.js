var redo = [];
var moves = [];
var step = 0;
var gamePad = [[]];
var goals = [];
var goal = null;
var activeRobot = null;

var goalsAndWalls = [
    {
        goals: [[
            { color: "red", sign: "star", x: 2, y: 5 },
            { color: "yellow", sign: "cog", x: 1, y: 3 },
            { color: "blue", sign: "moon", x: 6, y: 1 },
            { color: "green", sign: "planet", x: 5, y: 4 },
            { color: "multi", sign: "whirlwind", x: 7, y: 5 }
        ], [
            { color: "red", sign: "star", x: 2, y: 1 },
            { color: "yellow", sign: "cog", x: 6, y: 4 },
            { color: "blue", sign: "moon", x: 5, y: 6 },
            { color: "green", sign: "planet", x: 1, y: 3 },
            { color: "multi", sign: "whirlwind", x: 3, y: 7 }
        ]],
        walls: [[
            { x: 1, y: 3, wall: ["top", "right"] },
            { x: 2, y: 5, wall: ["bottom", "right"] },
            { x: 6, y: 1, wall: ["bottom", "left"] },
            { x: 5, y: 4, wall: ["top", "left"] },
            { x: 7, y: 5, wall: ["bottom", "right"] },
            { x: 7, y: 7, wall: ["top", "left"] },
            { x: 3, y: 0, wall: ["right"] },
            { x: 0, y: 7, wall: ["top"] }
        ], [
        ]]
    }, { 
        goals: [[
            { color: "red", sign: "moon", x: 4, y: 1 },
            { color: "green", sign: "cog", x: 1, y: 2 },
            { color: "blue", sign: "planet", x: 3, y: 6 },
            { color: "yellow", sign: "star", x: 6, y: 3 }
        ], [
            { color: "red", sign: "moon", x: 3, y: 6},
            { color: "green", sign: "cog", x: 1, y: 2 },
            { color: "blue", sign: "planet", x: 6, y: 5 },
            { color: "yellow", sign: "star", x: 6, y: 1 }
        ]],
        walls: [[
            { x: 3, y: 6, wall: ["bottom", "left"] },
            { x: 6, y: 3, wall: ["bottom", "right"] },
            { x: 4, y: 1, wall: ["top", "left"] },
            { x: 1, y: 2, wall: ["top", "right"] },
            { x: 7, y: 7, wall: ["top", "left"] },
            { x: 1, y: 0, wall: ["right"] },
            { x: 0, y: 5, wall: ["bottom"] }
        ], [
        ]]
    }, {
        goals: [[
            { color: "red", sign: "cog", x: 1, y: 1 },
            { color: "blue", sign: "star", x: 2, y: 4 },
            { color: "green", sign: "moon", x: 6, y: 2},
            { color: "yellow", sign: "planet", x: 7, y: 5 }
        ], [
            { color: "red", sign: "cog", x: 7, y: 5 },
            { color: "blue", sign: "star", x: 5, y: 2 },
            { color: "green", sign: "moon", x: 2, y: 4 },
            { color: "yellow", sign: "planet", x: 1, y: 6 }
        ]],
        walls: [[
            { x: 2, y: 4, wall: ["bottom", "right"] },
            { x: 1, y: 1, wall: ["bottom", "left"] },
            { x: 6, y: 2, wall: ["top", "right"] },
            { x: 7, y: 5, wall: ["top", "left"] },
            { x: 7, y: 7, wall: ["top", "left"]},
            { x: 3, y: 0, wall: ["right"] },
            { x: 0, y: 6, wall: ["top"] }
        ], [
        ]]
    }, { 
        goals: [[
            { color: "red", sign: "planet", x: 4, y: 5 },
            { color: "blue", sign: "cog", x: 6, y: 3 },
            { color: "green", sign: "star", x: 1, y: 6 },
            { color: "yellow", sign: "moon", x: 2, y: 1 }
        ],[
            { color: "red", sign: "planet", x: 1, y: 2 },
            { color: "blue", sign: "cog", x: 2, y: 6 },
            { color: "green", sign: "star", x: 5, y: 1 },
            { color: "yellow", sign: "moon", x: 6, y: 4 }
        ]],
        walls: [[
            { x: 6, y: 3, wall: ["bottom", "left"] },
            { x: 4, y: 5, wall: ["top", "right"] },
            { x: 2, y: 1, wall: ["top", "left"] },
            { x: 1, y: 6, wall: ["bottom", "right"] },
            { x: 7, y: 7, wall: ["top", "left"] },
            { x: 4, y: 0, wall: ["right"] },
            { x: 0, y: 4, wall: ["top"] }
        ], [
        ]]
    }
];

// BYGGER ALLA VÄGGAR PÅ SPELPLANEN
function createWalls(gamepad, walls) {
    walls.forEach(function(tile) {
        tile.walls.forEach(function(wall) {
            if (wall == "top") {
                gamepad[tile.x][tile.y].top = false;
                gamepad[tile.x][tile.y-1].bottom = false;
            }
            if (wall == "bottom") {
                gamepad[tile.x][tile.y].bottom = false;
                gamepad[tile.x][tile.y+1].top = false;
            }
            if (wall == "right") {
                gamepad[tile.x][tile.y].right = false;
                gamepad[tile.x+1][tile.y].left = false;
            }
            if (wall == "left") {
                gamepad[tile.x][tile.y].left = false;
                gamepad[tile.x-1][tile.y].right = false;
            }
        });
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
                left: true
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
                    x: 15 - tile.y,
                    y: tile.x,
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
                    x: 15 - tile.x,
                    y: 15 - tile.y,
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
                    x: tile.y,
                    y: 15 - tile.x,
                    walls: walls
                });
            });
        } else {
            pad.forEach(function(tile) {
                console.log(tile);
                rotatedWalls.push({
                    x: tile.x,
                    y: tile.y,
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
				tmpy = goals[1][i].y;
				goals[1][i].y = goals[1][i].x;
				goals[1][i].x = 15 - tmpy;
		}

		for (var i = 0; i < goals[2].length; i++) {
				tmpy = goals[2][i].x;
				tmpx = goals[2][i].y;
				goals[2][i].x = 15 - tmpy;
				goals[2][i].y = 15 - tmpx;
		}

	for (var i = 0; i < goals[3].length; i++) {
		tmpx = goals[3][i].x;
		goals[3][i].x = goals[3][i].y;
		goals[3][i].y = 15 - tmpx;
	}

		return goals[0].concat(goals[1], goals[2], goals[3]);
}

// PLACERAR UT ROBOTORNA 
module.exports.placeRobots = function placeRobots() {
    var robots = [
        { color: "red", x: null, y: null },
		{ color: "blue", x: null, y: null },
		{ color: "green", x: null, y: null },
		{ color: "yellow", x: null, y: null }
    ];

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
    gameBoard = createWalls(gameBoard, gameWalls);

	return { goals: gameGoals, walls: gameWalls, board: gameBoard };
}

// VÄLJER VILKET MÅL SOM KOMMER HÄR NÄST
function chooseGoal() {
		console.log("STEPS: " + step);
		steps = 0;
		var gnr = Math.floor(Math.random()*goals.length);
		goal = goals[gnr];
		goals.splice(gnr, 1);
		console.log("Goal: " + goal.color + " " + goal.sign +
								" at x: " + goal.x + " y: "+ goal.y);
}


// KOLLAR OM ROBOTEN ÄR I DET RÄTTA MÅLET
function checkGoal() {
		if (goal.color != "multi") {
				console.log("Robot: " + activeRobot.color);
				console.log("Goal: " + JSON.stringify(goal));
				if (activeRobot.color == goal.color) {
						if (activeRobot.x == goal.x &&
								activeRobot.y == goal.y) { moves = []; chooseGoal();}
				}
		} else {
				if (activeRobot.x == goal.x &&
						activeRobot.y == goal.y) { moves = []; chooseGoal();}
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
