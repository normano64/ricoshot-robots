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
						[ { placement: {x: 1, y: 3}, wall: ["top", "right"]}, { placement: {x: 2, y: 5}, wall: ["bottom", "right"]}, { placement: {x: 6, y: 1}, wall: ["bottom", "left"]},
							{ placement: {x: 5, y: 4}, wall: ["top", "left"]}, { placement: {x: 7, y: 5}, wall: ["bottom", "right"]}, { placement: {x: 7, y: 7}, wall: ["top", "left"]},
							{ placement: {x: 3, y: 0}, wall: ["right"]}, { placement: {x: 0, y: 6}, wall: ["top"]}
						], []
				]},
		{ 
				goals: [
						[ {color: "red", sign: "moon", placement: {x: 4, y: 1}}, {color: "green", sign: "cogwheel", placement: {x: 1, y: 2}},
							{color: "blue", sign: "planet", placement: {x: 3, y: 6}}, {color: "yellow", sign: "star", placement: {x: 6, y: 3}}],
						
						[ {color: "red", sign: "moon", placement: {x: 3, y: 6}}, {color: "green", sign: "cogwheel", placement: {x: 1, y: 2}},
							{color: "blue", sign: "planet", placement: {x: 6, y: 5}}, {color: "yellow", sign: "star", placement: {x: 6, y: 1}}]],
				walls: [
						[ { placement: {x: 3, y: 6}, wall: ["bottom", "left"]}, { placement: {x: 6, y: 2}, wall: ["bottom", "right"]}, { placement: {x: 4, y: 1}, wall: ["top", "left"]},
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
						[ { placement: {x: 2, y: 4}, wall: ["bottom", "right"]}, { placement: {x: 1, y: 1}, wall: ["bottom", "left"]}, { placement: {x: 6, y: 2}, wall: ["top", "right"]},
							{ placement: {x: 7, y: 5}, wall: ["top", "left"]}, { placement: {x: 7, y: 7}, wall: ["top", "left"]}, { placement: {x: 3, y: 0}, wall: ["right"]},
							{ placement: {x: 0, y: 5}, wall: ["top"]}
						], []
				]},
		{ 
				goals: [
					[ {color: "red", sign: "planet", placement: {x: 4, y: 5}}, {color: "blue", sign: "cogwheel", placement: {x: 6, y: 3}},
						{color: "green", sign: "star", placement: {x: 1, y: 6}}, {color: "yellow", sign: "moon", placement: {x: 7, y: 3}}],
						
					[ {color: "red", sign: "planet", placement: {x: 1, y: 2}}, {color: "blue", sign: "cogwheel", placement: {x: 2, y: 6}},
						{color: "green", sign: "star", placement: {x: 5, y: 1}}, {color: "yellow", sign: "moon", placement: {x: 6, y: 4}}]],
				walls: [
						[ { placement: {x: 6, y: 3}, wall: ["bottom", "left"]}, { placement: {x: 4, y: 5}, wall: ["top", "right"]}, { placement: {x: 2, y: 1}, wall: ["top", "left"]},
							{ placement: {x: 1, y: 6}, wall: ["bottom", "right"]}, { placement: {x: 7, y: 7}, wall: ["top", "left"]}, { placement: {x: 4, y: 0}, wall: ["right"]},
							{ placement: {x: 0, y: 4}, wall: ["top"]}
						], []
				]}];

// export default goalsAndWalls;

// BYGGER ALLA VÄGGAR PÅ SPELPLANEN
function createWalls(gamepad, x, y, placements) {

		for (var i = 0; i < placements.length; i++) {
				if (placements[i] == "top") { 
						gamepad[x][y].top = false;
						gamepad[x][y-1].bottom = false;
				}
				if (placements[i] == "bottom") {
						gamepad[x][y].bottom = false;
						gamepad[x][y+1].top = false;
				}
				if (placements[i] == "right") {
						gamepad[x][y].right = false;
						gamepad[x+1][y].left = false;
				}
				if (placements[i] == "left") {
						gamepad[x][y].left = false;
						gamepad[x-1][y].right = false;
				}
		}

		return gamepad;
}

// BYGGER UPP GRUNDEN MED YTTERVÄGGAR
function makePad() {
		var n = 16;

		for (var i = 0; i < n; i++) {
				gamePad[i] = [];

				for (var j = 0; j < n; j++) {
						gamePad[i][j] = {top: true, right: true, bottom: true, left: true, robot: false};

						if (i == 0)  gamePad[i][j].left = false;
						if (i == 15) gamePad[i][j].right = false;
						if (j == 0)  gamePad[i][j].top = false;
						if (j == 15) gamePad[i][j].bottom = false;
				}
		}
		
		return gamePad;
}

// VRIDER VÄGGARNA
function twistWalls(walls) {

		for (var i = 0; i < walls[1].length; i++) {
				tmpy = walls[1][i].placement.y;
				walls[1][i].placement.y = walls[1][i].placement.x;
				walls[1][i].placement.x = 15 - tmpy;

				for (var j = 0; j < walls[1][i].wall.length; j++) {
						if (walls[1][i].wall[j] == "top")    { walls[1][i].wall[j] = "right"; }
						else if (walls[1][i].wall[j] == "right")  { walls[1][i].wall[j] = "bottom" }
						else if (walls[1][i].wall[j] == "bottom") { walls[1][i].wall[j] = "left"; }
						else if (walls[1][i].wall[j] == "left")   { walls[1][i].wall[j] = "top"; }
				}
		}

		for (var i = 0; i < walls[2].length; i++) {
				tmpx = walls[2][i].placement.x;
				walls[2][i].placement.x = walls[2][i].placement.y;
				walls[2][i].placement.y = 15 - tmpx;
				
				for (var j = 0; j < walls[2][i].wall.length; j++) {
						if (walls[2][i].wall[j] == "top")    { walls[2][i].wall[j] = "left"; }
						else if (walls[2][i].wall[j] == "right")  { walls[2][i].wall[j] = "top"; }
						else if (walls[2][i].wall[j] == "bottom") { walls[2][i].wall[j] = "right"; }
						else if (walls[2][i].wall[j] == "left")   { walls[2][i].wall[j] = "bottom"; }
				}			
		}

		for (var i = 0; i < walls[3].length; i++) {
				tmpy = walls[3][i].placement.x;
				tmpx = walls[3][i].placement.y;
				walls[3][i].placement.x = 15 - tmpy;
				walls[3][i].placement.y = 15 - tmpx;

				for (var j = 0; j < walls[3][i].wall.length; j++) {
						if (walls[3][i].wall[j] == "top")    { walls[3][i].wall[j] = "bottom"; }
						else if (walls[3][i].wall[j] == "right")  { walls[3][i].wall[j] = "left"; }
						else if (walls[3][i].wall[j] == "bottom") { walls[3][i].wall[j] = "top"; }
						else if (walls[3][i].wall[j] == "left")   { walls[3][i].wall[j] = "right"; }
				}
		}
		return walls[0].concat(walls[1].concat(walls[2].concat(walls[3])));
}

// VRIDER MÅLEN
function improvedTwist(goals) {
		
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

		return goals[0].concat(goals[1].concat(goals[2].concat(goals[3])));	
}

// PLACERAR UT ROBOTORNA 
function placeRobots(arrRobots) {
		var xy = [];
		
		for(var i = 0; i < arrRobots.length; i++) {
				tmpx = Math.floor(Math.random() * 16);
				tmpy = Math.floor(Math.random() * 16);

				tmp = {tmpx, tmpy};
								
				if ((tmpx == 7 && tmpy == 7) || (tmpx == 8 && tmpy == 7) ||
						(tmpx == 7 && tmpy == 8) ||	(tmpx == 8 && tmpy == 8)) {
						i--;
				} else {
						while(gamePad[tmpx][tmpy].robot == false) {
								arrRobots[i].placement.x = tmpx;
								arrRobots[i].placement.y = tmpy;
								gamePad[tmpx][tmpy].robot = true;
						}
				}
		}
		
		return arrRobots;
}

// SKAPAR SPELPLANEN
function createMap(aGoals, aWalls) {
		var pa = makePad(); // SKAPAR BRÄDET
		var goalsPrim = improvedTwist(aGoals);
		var tmpWalls = twistWalls(aWalls);
		
		for (var i = 0; i < tmpWalls.length; i++) { pa = createWalls( pa, tmpWalls[i].placement.x, tmpWalls[i].placement.y, tmpWalls[i].wall);} // ANROPAR createWalls SOM SKAPAR ALLA VÄGGAR PÅ SPELPLANEN

		console.log(JSON.stringify(pa));
		
		return [pa, goalsPrim];
}

function randomMap() {
	var gamePads = [0, 1, 2, 3];
	var gameGoals = [];
	var gameWalls = [];
	var gameBoard = makePad();
	
	while (gamePads.length != 0) {
		var nr = Math.floor(Math.random()*gamePads.length);
		var tmpGoalsAndWalls = goalsAndWalls[gamePads[nr]];

		gameGoals = gameGoals.concat([tmpGoalsAndWalls.goals[0]]);
		gameWalls = gameWalls.concat([tmpGoalsAndWalls.walls[0]]);

		gamePads.splice(nr, 1);
	}

	gameGoals = improvedTwist(gameGoals);
	gameWalls = twistWalls(gameWalls);

	// ANROPAR createWalls SOM SKAPAR ALLA VÄGGAR PÅ SPELPLANEN
	for (var i = 0; i < gameWalls.length; i++) { gameBoard = createWalls( gameBoard, gameWalls[i].placement.x, gameWalls[i].placement.y, gameWalls[i].wall)};

	return [gameGoals, gameBoard];
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

// "SKAPAR" ETT GAME
function game() {
		/*
		var pad1 = goalsAndWalls[0];
		var pad2 = goalsAndWalls[2];
		var pad3 = goalsAndWalls[3];
		var pad4 = goalsAndWalls[1];

		var gameGoals = [pad1.goals[0], pad2.goals[0], pad3.goals[0], pad4.goals[0]]; // The goals
		var gameWalls = [pad1.walls[0], pad2.walls[0], pad3.walls[0], pad4.walls[0]]; // The walls
		
		var gamesGoalandWalls = createMap(gameGoals, gameWalls);
		*/
		
		var gameGoalsAndWalls = randomMap();
		gameGoalsandWalls = createMap(gameGoalsAndWalls[0], gameGoalsAndWalls[1]);

		robots = placeRobots(robots);
		console.log("Robots: " + JSON.stringify(robots));

		gamePad = gameGoalsandWalls[0];
		goals = gameGoalsandWalls[1];
		
		chooseGoal();
		
		if (goal.color != "multi") {
				rcolor = robots.find(function(e) { return e.color == goal.color});
				console.log("rcolor: " + JSON.stringify(rcolor));
				if (goal.placement == rcolor.placement) {

				}
		} else { // DETTA ÄR INTE KLART
				rcolor = robots;
		}
				
		return gamePad;
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
gamePad = game();

function move(gameplan, e, robot) {
		var i = 0;

		// robot = activeRobot;
		
		if ( e == '38' ) { // up arrow
				while (gameplan[robot.placement.x][robot.placement.y-i].top == true) {		
							if ((robot.placement.y - i) > 0 &&
									gameplan[robot.placement.x][robot.placement.y-(i+1)].robot == false) {
									i++;
							} else { break;}
				}
				if (i != 0) {				
						gameplan[robot.placement.x][robot.placement.y].robot = false;
						gameplan[robot.placement.x][robot.placement.y-i].robot = true;
						robot.placement.y -= i;
						step += 1;
						checkGoal();
						moves.push({robot: activeRobot, movement: '40'});
				}
				
		} else if ( e == '40' ) { // down arrow
				while ( gameplan[robot.placement.x][robot.placement.y+i].bottom == true) {
						if ((robot.placement.y + i) < (gameplan.length-1) &&
								gameplan[robot.placement.x][robot.placement.y+(i+1)].robot == false) {
								i++;
						} else { break;}
				}
				if (i != 0) {
						gameplan[robot.placement.x][robot.placement.y].robot = false;
						gameplan[robot.placement.x][robot.placement.y+i].robot = true;
						robot.placement.y += i;
						step += 1;
						checkGoal();
						moves.push({robot: activeRobot, movement: '38'});
				}
				
		} else if ( e == '37') { // left arrow
				while ( gameplan[robot.placement.x-i][robot.placement.y].left == true) {
						if ((robot.placement.x - i) > 0 &&
								gameplan[robot.placement.x-(i+1)][robot.placement.y].robot == false) {
								i++;
						} else { break;}
				}
				if (i != 0) {
						gameplan[robot.placement.x][robot.placement.y].robot = false;
						gameplan[robot.placement.x-i][robot.placement.y].robot = true;
						robot.placement.x -= i;
						step += 1;
						checkGoal();
						moves.push({robot: activeRobot, movement: '39'});
				}

		} else if ( e == '39') { // right arrow
				while ( gameplan[robot.placement.x+i][robot.placement.y].right == true) {
						if ((robot.placement.x + i) < (gameplan.length-1) &&
								gameplan[robot.placement.x+(i+1)][robot.placement.y].robot == false) {
								i++;
						} else { break;}
				}

				if (i != 0) {
						gameplan[robot.placement.x][robot.placement.y].robot = false;
						gameplan[robot.placement.x+i][robot.placement.y].robot = true;
						robot.placement.x += i;
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
