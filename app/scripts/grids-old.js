'use strict';

//global variables
// var canvas = document.getElementById('canvas');
// var ctx = canvas.getContext('2d');
var GRID_SIZE = 20;
var GRID_STROKE = 2;
var totalSize = GRID_SIZE + 2 * GRID_STROKE;
var shapesPool = [
	{
		height: 3,
		width: 2,
		points: [
			[1, 0],
			[1, 1],
			[0, 1]
		],
		color: 'red'
	},

	{
		height: 3,
		width: 2,
		points: [
			[0, 1],
			[1, 1],
			[1, 0]
		],
		color: 'blue'
	},
	{
		height: 4,
		width: 1,
		points: [
			[1],
			[1],
			[1],
			[1]
		],
		color: 'green'
	},
	{
		height: 2,
		width: 3,
		points: [
			[1, 1, 1],
			[0, 1, 0]
		],
		color: 'yellow'

	},
	{
		height: 2,
		width: 2,
		points: [
			[1, 1],
			[1, 1]
		],
		color: 'purple'
	},
	{
		height: 3,
		width: 2,
		points: [
			[1, 1],
			[0, 1],
			[0, 1]
		],
		color: 'orange'
	},
	{
		height: 3,
		width: 2,
		points: [
			[1, 1],
			[1, 0],
			[1, 0]
		],
		color: 'pink'
	}
];

function drawGrid(posX, posY, ctx, color) {
	ctx.fillStyle = color;
	ctx.fillRect(posX, posY, GRID_SIZE, GRID_SIZE);

	// ctx.strokeStyle = '#000000';
	// ctx.lineWidth = GRID_STROKE;
	// ctx.strokeRect(posX, posY, GRID_SIZE - 1, GRID_SIZE - 1);
}

function checkFilledLine(line) {
	var output = true;
	for(var i = 0; i < board.width; i++) {
		if(line.indexOf(i) <= -1) {
			output = false;
		}
	}

	return output;
}

//Get a random number betwee min and max (both inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cloneCanvas(oldCanvas) {

    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}

function Grids(options) {
	this.shape = null;
	this.width = 1;
	this.height = 1;
	this.posX = 0;
	this.posY = 0;

	this.fps = 1;
	this.now = null;
	this.then = null;
	this.delta = null;
	this.interval = 1000/this.fps;

	this.rotateCount = 0;
	this.moveToSideCount = 0;

	for(var n in options) {
		this[n] = options[n];
	}

	this.width = this.shape.width;
	this.height = this.shape.height;
	this.color = this.shape.color;
	this.shapePoints = this.shape.shapePoints;

	this.fall = function() {
		var top = this.canvas.style.top;
		top = top ? parseInt(top.replace('px', '')) : 0;

		var valid = this.validate(0, 1, false);
		var posX = this.posX;
		var posY = this.posY;
		var width = this.width;
		var height = this.height;
		var shapePoints = this.shapePoints;
		var interval = 1000/this.fps;
		var color = this.color;
		var boardCanvas = board.canvas;
		var boardCtx = board.ctx;
		var boardWidth = board.width * GRID_SIZE;
		var boardHeight = board.height * GRID_SIZE;
		var ifClear = true;
		var previousLine = null;
		var frameId = this.frameId;
		var linesToClear = [];

		//When stopped
		if(top >= (board.height * GRID_SIZE - this.height * GRID_SIZE) || !valid) {
			//Update state to be "still"
			this.state = 'still';

			for(var i = 0; i < shapePoints.length; i++) {
				for(var j = 0; j < shapePoints[i].length; j++) {
					if(shapePoints[i][j]) {
						board.filledPoints.push([posX + j, posY + i]);
						board.filledLines[posY + i].push(posX + j);
					}
				}
			}

			//Clear the grid's own canvas and paint on the board's canvas
			this.ctx.clearRect(0, 0, width * GRID_SIZE, height * GRID_SIZE);
			for(var k = 0; k < shapePoints.length; k++) {
				for(var m = 0; m < shapePoints[k].length; m++) {
					if(shapePoints[k][m]) {
						drawGrid((posX + m) * GRID_SIZE, (posY + k) * GRID_SIZE, boardCtx, color);
					}
				}
			}

			//Check if a line can be cleared
			for(var line in board.filledLines) {
				if(checkFilledLine(board.filledLines[line])) {
					var canvasCopy = cloneCanvas(board.canvas);
					boardCtx.clearRect(0, 0, board.width * GRID_SIZE, (parseInt(line) + 1) * GRID_SIZE);
					boardCtx.drawImage(canvasCopy, 0, 0, board.width * GRID_SIZE, line * GRID_SIZE, 0, GRID_SIZE, board.width * GRID_SIZE, line * GRID_SIZE);
					
					for(var p = 0; p < board.filledPoints.length; p++) {
						if(board.filledPoints[p][1] == line) {
							board.filledPoints.splice(p, 1);
							p--;
						} else if(board.filledPoints[p][1] < line){
							board.filledPoints[p][1] += 1;
						}
					}
					for(var q = board.height - 1; q >= 0; q--) {
						if(q == 0) {
							board.filledLines[q] = [];
						} else if(q <= line) {
							board.filledLines[q] = board.filledLines[q - 1];
						}
					}
				}
			}

			//Check if reached the top so that game can be ended
			console.log(posY);
			if(posY <= 0) {
				currentGrid = null;
				document.querySelector('.note').innerHTML = "Game ends!";
			} else {
				//Generate a new grid
				var randomNumber = getRandomInt(0, 6);
				currentGrid = new Grids({shape: shapesPool[randomNumber], posX: 0, posY: -4});
			}

			return false;

		}

		this.frameId = requestAnimationFrame(this.fall.bind(this, interval));

		this.now = Date.now();
		this.delta = this.now - this.then;

		if(this.delta > interval) {
			//First check if next position is available
			this.then = this.now - (this.delta % interval);
			top = (top + GRID_SIZE) + 'px';
			this.canvas.style.top = top;

			//Update posY of the currentGrid
			this.posY++;

		}
	}

	this.validate = function(offsetX, offsetY, ifRotate) {
		var posX = this.posX + offsetX;
		var posY = this.posY + offsetY;
		var height;
		var width;
		if(ifRotate) {
			height = this.width;
			width = this.height;
		} else {
			height = this.height;
			width = this.width;
		}
		var shapePoints = this.shapePoints;
		if(ifRotate) {
			shapePoints = rotateShapePoints(shapePoints);
		}
		var output = true;

		board.filledPoints.forEach(function(filledPoint) {
			for(var i = 0; i < shapePoints.length; i++) {
				for(var j = 0; j < shapePoints[i].length; j++) {
					if(shapePoints[i][j]) {
						if((posX + j) == filledPoint[0] &&
							(posY + i) == filledPoint[1]) {
							output = false;
						}
					}
				}
			}
		})

		if (posX > (board.width - width)
			|| posX < 0) {
			output = false;
		}

		return output;
	}

	this.init = function() {
		var numberX = this.width;
		var numberY = this.height;
		var posX = this.posX;
		var posY = this.posY;
		var shapePoints = this.shapePoints;
		var color = this.color;
		var interval = this.interval;

		//Manage IDs of grids
		this.previousId = GRID_IDS.length ? GRID_IDS[GRID_IDS.length - 1] : -1;
		this.id = this.previousId + 1;
		GRID_IDS.push(this.id);

		//Set initial state to be "falling"
		this.state = 'falling';

		this.then = Date.now();

		//create grid's own canvas and context
		var gCanvas = document.createElement('canvas');
		var gCtx = gCanvas.getContext('2d');
		gCanvas.width = numberX * GRID_SIZE;
		gCanvas.height = numberY * GRID_SIZE;
		gCanvas.style.top = posY * GRID_SIZE + 'px';

		container.appendChild(gCanvas);

		for(var i = 0; i < shapePoints.length; i++) {
			for(var j = 0; j < shapePoints[i].length; j++) {
				if(shapePoints[i][j]) {
					drawGrid((0 + j) * GRID_SIZE, (0 + i) * GRID_SIZE, gCtx, color);
				}
			}
		}

		this.canvas = gCanvas;
		this.ctx = gCtx;

		this.fall()
	};

	this.init();
}
