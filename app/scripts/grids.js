'use strict';

//global variables
// var canvas = document.getElementById('canvas');
// var ctx = canvas.getContext('2d');
var gridSize = 20;
var gridStroke = 2;
var totalSize = gridSize + 2 * gridStroke;
var shapesPool = [
	{
		height: 3,
		width: 2,
		points: [[1, 0], [0, 2]],
		color: 'red'
	},

	{
		height: 3,
		width: 2,
		points: [[0, 0], [1,2]],
		color: 'blue'
	},
	{
		height: 4,
		width: 1,
		points: [],
		color: 'green'
	},
	{
		height: 2,
		width: 3,
		points: [[0, 1], [2, 1]],
		color: 'yellow'

	},
	{
		height: 2,
		width: 2,
		points: [],
		color: 'purple'
	},
	{
		height: 3,
		width: 2,
		points: [[0, 1], [0, 2]],
		color: 'orange'
	},
	{
		height: 3,
		width: 2,
		points: [[1, 1], [1, 2]],
		color: 'pink'
	}
];

function drawGrid(posX, posY, ctx, color) {
	ctx.fillStyle = color;
	ctx.fillRect(posX, posY, gridSize, gridSize);

	ctx.strokeStyle = '#000000';
	ctx.lineWidth = gridStroke;
	ctx.strokeRect(posX, posY, gridSize, gridSize);
}

function compareArray(array1, array2) {
	if(!array1 || !array2 || array1.length !== array2.length) {
		return false;
	}

	for(var i = 0; i < array1.length; i++) {
		if(array1[i] !== array2[i]) {
			return false;
		}
	}

	return true;
}

//Get a random number betwee min and max (both inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Grids(options) {
	this.shape = null;
	this.width = 1;
	this.height = 1;
	this.posX = 0;
	this.posY = 0;

	this.fps = 10;
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
	this.points = this.shape.points;
	this.color = this.shape.color;

	this.fall = function(timestamp) {
		var top = this.canvas.style.top;
		top = top ? parseInt(top.replace('px', '')) : 0;

		var valid = this.validate(0, 1, false);
		var arr = ['banana'];
		var posX = this.posX;
		var posY = this.posY;
		var width = this.width;
		var height = this.height;

		//When stopped
		if(top >= (board.height * gridSize - this.height * gridSize) || !valid) {
			//Update state to be "still"
			this.state = 'still';

			//Update positions
			console.log(posY);
			console.log(posY - height);
			for(var i = posX; i < posX + width; i++) {
				for(var j = posY; j < posY + height; j++) {
					board.filledPoints.push([i,j]);
					console.log(board.filledPoints);
					console.log('board ' + i + ' ' + j + ' now is unavailable')
				}
			}

			//Generate a new grid
			var randomNumber = getRandomInt(0, 6);
			currentGrid = new Grids({shape: shapesPool[randomNumber], posX: 0, posY: 0});
			return false;
		};

		requestAnimationFrame(this.fall.bind(this));

		this.now = Date.now();
		this.delta = this.now - this.then;

		if(this.delta > this.interval) {
			//First check if next position is available
			this.then = this.now - (this.delta % this.interval);
			top = (top + gridSize) + 'px';
			this.canvas.style.top = top;

			//Update posY of the currentGrid
			this.posY++;

		}
	}

	this.validate = function(offsetX, offsetY, ifRotate) {
		var posX = this.posX + offsetX;
		var posY = this.posY + offsetY;
		var height = this.height;
		var width = this.width;

		if(ifRotate) {
			this.height = width;
			this.width = height;
		}

		board.filledPoints.forEach(function(point) {
			if(point[0] == posX
			   || point[0] == posX + width
			   || point[1] == posY
			   || point[1] == posY) {
				return false;
			}
		})

		if (posX > (board.width - width)
			|| posX < 0) {
			return false;
		}

		return true;
	}

	this.init = function() {
		console.log('new grid init');
		var numberX = this.width;
		var numberY = this.height;
		var posX = this.posX;
		var posY = this.posY;
		var points = this.points;
		var color = this.color;

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
		gCanvas.width = numberX * gridSize;
		gCanvas.height = numberY * gridSize;

		container.appendChild(gCanvas);

		for(var i = 0; i < numberX; i++) {
			for(var j = 0; j < numberY; j++) {
				if(!compareArray(points[0], [i,j]) && !compareArray(points[1], [i,j])) {
					drawGrid((posX + i) * gridSize, (posY + j) * gridSize, gCtx, color);
				}
			}
		}

		this.canvas = gCanvas;
		this.ctx = gCtx;

		this.fall()
	};

	this.init();
}
