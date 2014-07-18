'use strict';

/**
* Global constants
*/

var GRID_SIZE = 20;
var GRID_STROKE = 2;
var GRID_SIZE_TOTAL = GRID_SIZE + 2 * GRID_STROKE;
var shapesPool = [
	{
		height: 3,
		width: 2,
		shapePoints: [
			[1, 0],
			[1, 1],
			[0, 1]
		],
		color: 'red'
	},

	{
		height: 3,
		width: 2,
		shapePoints: [
			[0, 1],
			[1, 1],
			[1, 0]
		],
		color: 'blue'
	},
	{
		height: 4,
		width: 1,
		shapePoints: [
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
		shapePoints: [
			[1, 1, 1],
			[0, 1, 0]
		],
		color: 'yellow'

	},
	{
		height: 2,
		width: 2,
		shapePoints: [
			[1, 1],
			[1, 1]
		],
		color: 'purple'
	},
	{
		height: 3,
		width: 2,
		shapePoints: [
			[1, 1],
			[0, 1],
			[0, 1]
		],
		color: 'orange'
	},
	{
		height: 3,
		width: 2,
		shapePoints: [
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

/**
 * Instantiate a tetrimino with a random shape.
 *
 * @constructor
 * @param {Object} one shape object in shapesPool array
 */
function Tetromino(shape) {
	'use strict';
	//Get properties filled in from the shape parameter
	this.shape = shape;
	this.width = shape.width;
	this.height = shape.height;
	this.color = shape.color;
	this.points = shape.points;
	this.posX = 0;
	this.posY = 0;

	this.fps = 1;
	this.now = null;
	this.then = null;
	this.delta = null;
	this.interval = 1000/this.fps;

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

	// this.validate = function(offsetX, offsetY, ifRotate) {
	// 	var posX = this.posX + offsetX;
	// 	var posY = this.posY + offsetY;
	// 	var height;
	// 	var width;
	// 	if(ifRotate) {
	// 		height = this.width;
	// 		width = this.height;
	// 	} else {
	// 		height = this.height;
	// 		width = this.width;
	// 	}
	// 	var shapePoints = this.shapePoints;
	// 	if(ifRotate) {
	// 		shapePoints = rotateShapePoints(shapePoints);
	// 	}
	// 	var output = true;

	// 	board.filledPoints.forEach(function(filledPoint) {
	// 		for(var i = 0; i < shapePoints.length; i++) {
	// 			for(var j = 0; j < shapePoints[i].length; j++) {
	// 				if(shapePoints[i][j]) {
	// 					if((posX + j) == filledPoint[0] &&
	// 						(posY + i) == filledPoint[1]) {
	// 						output = false;
	// 					}
	// 				}
	// 			}
	// 		}
	// 	})

	// 	if (posX > (board.width - width)
	// 		|| posX < 0) {
	// 		output = false;
	// 	}

	// 	return output;
	// }

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

/**
 * Helper function: iterate given shape's points
 *
 * @param {array} shape's points
 * @param {function} callback to be called on each solid point
 */
function iteratePoints(points, callback) {
	var i, j;
	for (i = 0; i < points.length; i++) {
		for (j = 0; j < points[i].length; j++) {
			if (point[i][j]) {
				if (typeof callback === 'function') {
					callback.call(null, i, j);
				}
			}
		}
	}
}

/**
 * Helper function: rotate given shape's points by 90 degrees clockwise
 *
 * @param {array} shape's points
 * @returns {array} rotated shape's points
 */
 function rotatePoints(points) {
 	var i, j, k, output;

 	output = new Array(points[0].length);

 	for (k = 0; k < points.length; k++) {
 		output[k] = [];
 	}

 	for (i = 0; i < points.length; i++) {
 		for (j = 0; j < points.length; j++) {
 			output[j].unshift(points[i][j]);
 		}
 	}

 	return output;
 }

/**
 * Determines if Tetromino's next position is valid 
 *
 * @param {number} offset x
 * @param {number} offset y
 * @param {boolean} if Tetrimino is rotating
 * @returns {boolean} Returns true if the next position is valid and thus can proceed
 */
Tetromino.prototype.valid = function(offsetX, offsetY, rotate) {
	var posX,
		posY,
		height,
		width,
		points;

	posX = this.posX + offsetX;
	posY = this.posY + offsetY;
	height = this.height;
	width = this.width;
	points = this.points;

	//If rotating, swap height and width
	//and rotate the points pattern by 90 degrees clockwise
	if (rotate) {
		height = this.width;
		width = this.height;
		points = rotatePoints(points);
	}

	board.filledPoints.forEach(function(filledPoint) {
		iteratePoints(points, function(i, j) {
			if ((posX + j) == filledPoint[0] && (posY + i) == filledPoint[1]) {
				return false;
			}
		})
	});

	if (posX > (board.width - width) || posX < 0) {
		return false;
	}

	return true;
}
