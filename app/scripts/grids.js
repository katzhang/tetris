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
		points: [[1, 0], [0, 2]]
	},

	{
		height: 3,
		width: 2,
		points: [[0, 0], [1,2]]
	},
	{
		height: 4,
		width: 1,
		points: []
	},
	{
		height: 2,
		width: 3,
		points: [[0, 1], [2, 1]]

	},
	{
		height: 2,
		width: 2,
		points: []
	},
	{
		height: 3,
		width: 2,
		points: [[0, 1], [0, 2]]
	},
	{
		height: 3,
		width: 2,
		points: [[1, 1], [1, 2]]
	}
];

function drawGrid(posX, posY, ctx) {
	ctx.fillStyle = 'red';
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

function Grids(options) {
	this.shape = null;
	this.width = 1;
	this.height = 1;
	this.posX = null;
	this.posY = null;

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

	this.fall = function(timestamp) {
		var top = this.canvas.style.top;
		top = top ? parseInt(top.replace('px', '')) : 0;
		if(top >= (board.height - this.height * gridSize)) return false;
		requestAnimationFrame(this.fall.bind(this));
		this.now = Date.now();
		this.delta = this.now - this.then;

		if(this.delta > this.interval) {
			this.then = this.now - (this.delta % this.interval);
			top = (top + gridSize) + 'px';
			this.canvas.style.top = top;
		}
	}

	this.init = function() {
		console.log('new grid init');
		var numberX = this.width;
		var numberY = this.height;
		var posX = this.posX;
		var posY = this.posY;
		var points = this.points;

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
					drawGrid(posX + i * gridSize, posY + j * gridSize, gCtx);
				}
			}
		}

		this.canvas = gCanvas;
		this.ctx = gCtx;

		this.fall()
	};

	this.init();
}
