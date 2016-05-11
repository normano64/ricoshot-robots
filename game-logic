var step = 0;
var gamePad = [[]];
var goals = [];
var goal = null;
var activeRobot = null;
var robots = [{color: "red", placement: {x: null, y: null}},
							{color: "blue", placement: {x: null, y: null}},
							{color: "green", placement: {x: null, y: null}},
							{color: "yellow", placement: {x: null, y: null}}];

padOneGoals = [[{color: "red", sign: "star", placement: {x: 2, y: 5}}, 
 								{color: "blue", sign: "moon", placement: {x: 6, y: 1}},
 								{color: "green", sign: "planet", placement: {x: 5, y: 4}},
 								{color: "yellow", sign: "cogwheel", placement: {x: 1, y: 3}},
 								{color: "multi", sign: "whirlwind", placement: {x: 7, y: 5}}]];

padOneWalls = [ // yellow cogwheel, red star, blue moon, green planet, multi
		[ 
				[1, 3, ["top", "right"]], [2, 5, ["bottom", "right"]], 
				[6, 1, ["bottom", "left"]], [5, 4, ["top", "left"]],  
				[7, 5, ["bottom", "right"]], [7, 7, ["top", "left"]],
				[3, 0, ["right"]], [0, 6, ["top"]]
		]
];

padTwoGoals = [[{color: "red", sign: "moon", placement: {x: 4, y: 1}},
								{color: "blue", sign: "planet", placement: {x: 3, y: 6}},
								{color: "green", sign: "cogwheel", placement: {x: 1, y: 2}},
								{color: "yellow", sign: "star", placement: {x: 6, y: 3}}]];

padTwoWalls = [ // blue planet, yellow star, red moon,  green cogwheel
		[
				[3, 6, ["top", "right"]], [6, 3, ["top", "left"]],
				[4, 1, ["bottom", "right"]], [1, 2, ["bottom", "left"]],
				[7, 7, ["top", "left"]], [1, 0, ["right"]], [0, 5, ["top"]]
		]
];

padThreeGoals = [[{color: "red", sign: "cogwheel", placement: {x: 1, y: 1}},
									{color: "blue", sign: "star", placement: {x: 2, y: 4}},
									{color: "green", sign: "moon", placement: {x: 6, y: 2}},
									{color: "yellow", sign: "planet", placement: {x: 7, y: 5}}]];

padThreeWalls = [ // blue star, red cogwheel, green moon, yellow planet
		[
				[2, 4, ["bottom", "left"]], [1, 1, ["top", "left"]],
				[6, 2, ["bottom", "right"]], [7, 5, ["top", "right"]],
				[7, 7, ["top", "left"]], [3, 0, ["right"]], [0, 5, ["top"]]
		]					 
];

padFourGoals = [[{color: "red", sign: "planet", placement: {x: 4, y: 5}},
				 {color: "blue", sign: "cogwheel", placement: {x: 6, y: 3}},
				 {color: "green", sign: "star", placement: {x: 1, y: 6}},
				 {color: "yellow", sign: "moon", placement: {x: 7, y: 3}}]];

padFourWalls = [ // blue cogwheel, red planet, yellow moon, green star
		[
				[6, 3, ["bottom", "right"]], [4, 5, ["top", "left"]],      
				[2, 1, ["bottom", "left"]], [1, 6, ["top", "right"]],     
				[7, 7, ["top", "left"]], [4, 0, ["right"]], [0, 4, ["top"]]
		]
];

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

// TROR INTE ATT DEN HÄR ANVÄNDS ... än
function createOuterWalls(n) {
		var pad = [n];
		
		for (var i = 0; i < n; i++) {
				pad[i] = [n];
				for (var j = 0; j < n; j++) {
						pad[i][j] = {top: true, right: true, bottom: true, left: true, robot: false};
						if (i == 0) pad[i][j].left = false;
						if (j == 0) pad[i][j].top = false;
						if (i == 7 && j == 7) { pad[i][j].top = false; pad[i][j].left = false;}
				}
		}
		
		return pad;
}

// DEN HÄR ANVÄNDS
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
						// if (i == 7 && j == 7) { gamePad[i][j].top = false; gamePad[i][j].left = false;}
						// if (i == 8 && j == 7) { gamePad[i][j].top = false; gamePad[i][j].right = false;}
						// if (i == 7 && j == 8) { gamePad[i][j].bottom = false; gamePad[i][j].left = false;}
						// if (i == 8 && j == 8) { gamePad[i][j].bottom = false; gamePad[i][j].right = false;}
				}
		}
		
		return gamePad;
}
		
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

function createMap(gamePad) {
		var pa = makePad();

		var walls = [
				[1, 3, ["top", "right"]], [2, 5, ["bottom", "right"]], // yellow cogwheel red star
				[6, 1, ["bottom", "left"]], [11, 2, ["bottom", "left"]], // blue moon blue star 
				[14, 1, ["top", "left"]], [5, 4, ["top", "left"]], // red cogwheel green planet 
				[7, 5, ["bottom", "right"]], [13, 6, ["bottom", "right"]], // multi green moon
				[10, 7, ["top", "right"]], [3, 9, ["bottom", "right"]], // yellow planet blue cogwheel
				[12, 9, ["top", "right"]], [5, 11, ["top", "left"]], // blue planet red planet
				[1, 13, ["bottom", "left"]], [9, 12, ["top", "left"]], // yellow moon and star
				[6, 14, ["top", "right"]], [11, 14, ["bottom", "right"]], // green star red moon
				[14, 13, ["bottom", "left"]], // green cogwheel
				[7, 7, ["top", "left"]], [7, 8, ["bottom", "left"]],
				[8, 7, ["top", "right"]], [8, 8, ["bottom", "right"]],
				[0, 6, ["bottom"]], [0, 10, ["bottom"]], [3, 0, ["right"]], [9, 0, ["right"]],
				[4, 15, ["right"]], [13, 15, ["right"]],[15, 3, ["bottom"]], [15, 9, ["bottom"]]
		];
		
		for (var i = 0; i < walls.length; i++) {
				pa = createWalls(pa, walls[i][0], walls[i][1], walls[i][2]);
		}
		
		var goalsPrim = improvedTwist(gamePad);
		
		return [pa, goalsPrim];
}

function chooseGoal() {
		console.log("STEPS: " + step);
		steps = 0;
		var gnr = Math.floor(Math.random()*goals.length);
		goal = goals[gnr];
		goals.splice(gnr, 1);
		console.log("Goal: " + goal.color + " " + goal.sign + " at x: " +
								goal.placement.x + " y: "+ goal.placement.y);
		// console.log(JSON.stringify(goal));
}

function primGame() {
		// The goals pads
		var gameGoals = [padOneGoals[0], padThreeGoals[0], padFourGoals[0], padTwoGoals[0]];
		var padAndGoals = createMap(gameGoals);
		// console.log(JSON.stringify(padAndGoals[0]));
		
		robots = placeRobots(robots);
		console.log(JSON.stringify(robots));
		
		gamePad = padAndGoals[0];
		goals = padAndGoals[1];

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

function checkGoal() {
		if (goal.color != "multi") {
				console.log(activeRobot.color + " " + goal.color);
				if (activeRobot.color == goal.color) {
						if (activeRobot.placement.x == goal.placement.x && 
								activeRobot.placement.y == goal.placement.y) { chooseGoal();}
				}
		} else {
				if (activeRobot.placement.x == goal.placement.x &&
						activeRobot.placement.y == goal.placement.y) { chooseGoal();}
		}
}

gamePad = primGame();


function move(gameplan, e) {
		var i = 0;
		// console.log(JSON.stringify(gameplan));

		//robots.find(function(rob) {if (rob.color == activeRobot) return rob});
		robot = activeRobot;
		
		if ( e.keyCode == '38' ) { // up arrow
				while (gameplan[robot.placement.x][robot.placement.y-i].top == true) {		
							if ((robot.placement.y - i) > 0 &&
									gameplan[robot.placement.x][robot.placement.y-(i+1)].robot == false) {
									i++;
							} else { break;}
				}
								
				gameplan[robot.placement.x][robot.placement.y].robot = false;
				gameplan[robot.placement.x][robot.placement.y-i].robot = true;
				robot.placement.y -= i;
				step += 1;
				checkGoal();
		} else if ( e.keyCode == '40' ) { // down arrow
				while ( gameplan[robot.placement.x][robot.placement.y+i].bottom == true) {
						if ((robot.placement.y + i) < (gameplan.length-1) &&
								gameplan[robot.placement.x][robot.placement.y+(i+1)].robot == false) {
								i++;
						} else { break;}
				}
				
				gameplan[robot.placement.x][robot.placement.y].robot = false;
				gameplan[robot.placement.x][robot.placement.y+i].robot = true;
				robot.placement.y += i;
				step += 1;
				checkGoal();
		} else if ( e.keyCode == '37') { // left arrow
				while ( gameplan[robot.placement.x-i][robot.placement.y].left == true) {
						if ((robot.placement.x - i) > 0 &&
								gameplan[robot.placement.x-(i+1)][robot.placement.y].robot == false) {
								i++;
						} else { break;}
				}
				
				gameplan[robot.placement.x][robot.placement.y].robot = false;
				gameplan[robot.placement.x-i][robot.placement.y].robot = true;
				robot.placement.x -= i;
				step += 1;
				checkGoal();

		} else if ( e.keyCode == '39') { // right arrow
				while ( gameplan[robot.placement.x+i][robot.placement.y].right == true) {
						if ((robot.placement.x + i) < (gameplan.length-1) &&
								gameplan[robot.placement.x+(i+1)][robot.placement.y].robot == false) {
								i++;
						} else { break;}
				}
		
				gameplan[robot.placement.x][robot.placement.y].robot = false;
				gameplan[robot.placement.x+i][robot.placement.y].robot = true;
				robot.placement.x += i;
				step += 1;
				checkGoal();
		}
		
		console.log(JSON.stringify(robot));
		console.log(JSON.stringify(robots));
}


// function checkKey(gameplan, robot, e) {
function checkKey(e) {
		e = e || window.event;

		if (e.keyCode >= '37' && e.keyCode <= '40') {
				move(gamePad,  e);
		} else if (e.keyCode >= '49' && e.keyCode <= '52') {
				if (e.keyCode =='49') { // red robot
						activeRobot = robots[0];
						console.log("red");
						console.log(JSON.stringify(robots[0]));
						// {color: "red", placement: {x: null, y: null}},
				} else if (e.keyCode == '50') { // blue robot
						activeRobot = robots[1];
						console.log("blue");
						console.log(JSON.stringify(robots[1]));
				} else if (e.keyCode == '51') { // green robot
						activeRobot = robots[2];
						console.log("green");
						console.log(JSON.stringify(robots[2]));
				} else if (e.keyCode == '52') { // yellow robot
						activeRobot = robots[3];
						console.log("yellow");
						console.log(JSON.stringify(robots[3]));
				}
		}
}
