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

function checkFilledLine(line) {
	var output = true;
	for(var i = 0; i < board.width; i++) {
		if(line.indexOf(i) <= -1) {
			output = false;
		}
	}

	return output;
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


	this.init = function() {
		var numberX = this.width;
		var numberY = this.height;
		var posX = this.posX;
		var posY = this.posY;
		var points = this.points;
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

		for(var i = 0; i < points.length; i++) {
			for(var j = 0; j < points[i].length; j++) {
				if(points[i][j]) {
					this.drawGrid((0 + j) * GRID_SIZE, (0 + i) * GRID_SIZE, gCtx, color);
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
 * Iterate given shape's points
 *
 * @param {array} shape's points
 * @param {function} callback to be called on each solid point
 */
Tetromino.prototype.iteratePoints = function(points, callback) {
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
 * Rotate given shape's points by 90 degrees clockwise
 *
 * @param {array} shape's points
 * @returns {array} rotated shape's points
 */
Tetromino.prototype.rotatePoints = function(points) {
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
		points = this.rotatePoints(points);
	}

	board.filledPoints.forEach(function(filledPoint) {
		this.iteratePoints(points, function(i, j) {
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

/**
 * Determines if Tetromino should stop falling and freeze
 *
 * @returns {boolean} Returns true if Tetromino should stop
 */
Tetromino.prototype.stop = function() {
	var valid, bottom;
	valid = this.valid(0, 1, false);
	bottom = (top >= (board.height - this.height) * GRID_SIZE);

	if (!valid || bottom) {
		return true;
	}

	return false;
}

/**
 * Draw Tetromino's grid given the positions, context and color
 *
 * @param {number} offset x
 * @param {number} offset y
 * @param {object} canva's context object
 * @param {string} color of the grid
 */
Tetromino.prototype.drawGrid = function(posX, posY, ctx, color) {
	ctx.fillStyle = color;
	ctx.fillRect(posX, posY, GRID_SIZE, GRID_SIZE);

	// ctx.strokeStyle = '#000000';
	// ctx.lineWidth = GRID_STROKE;
	// ctx.strokeRect(posX, posY, GRID_SIZE - 1, GRID_SIZE - 1);
}

/**
 * Determines if a given line is all filled
 *
 * @param {number} line number
 * @returns {boolean} Returns true if the line is all filled
 */
Tetromino.prototype.checkFilledLine = function(line) {
	var i;

	for(i = 0; i < board.width; i++) {
		if(line.indexOf(i) <= -1) {
			return false
		}
	}

	return true;
}

/**
 * Makes Tetromino fall before reaching the bottom surface
 */
Tetromino.prototype.fall = function() {
	var top = this.canvas.style.top;
	top = top ? parseInt(top.replace('px', '')) : 0;

	var stop = this.stop();
	var posX = this.posX;
	var posY = this.posY;
	var width = this.width;
	var height = this.height;
	var points = this.points;

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
	if(stop) {
		//Clear Tetromino's own canvas
		this.ctx.clearRect(0, 0, width * GRID_SIZE, height * GRID_SIZE);

		iteratePoints(points, function(i, j) {
			//Update filled points and filled lines data
			board.filledPoints.push([posX + j, posY + i]);
			board.filledLines[posY + i].push(posX + j);

			this.drawGrid((posX + j) * GRID_SIZE, (posY + i) * GRID_SIZE, boardCtx, color);
		});

		//Check if a line can be cleared
		for(var line in board.filledLines) {
			if(this.checkFilledLine(board.filledLines[line])) {
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
			currentTetromino = null;
			document.querySelector('.note').innerHTML = "Game ends!";
		} else {
			//Generate a new grid
			var randomNumber = getRandomInt(0, 6);
			currentTetromino = new Tetromino(shapesPool[randomNumber]);
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

		//Update posY of the currentTetromino
		this.posY++;

	}

}
