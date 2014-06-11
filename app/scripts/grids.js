'use strict';

//global variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var gridSize = 20;
var gridStroke = 2;

function drawGrid(posX, posY) {
	ctx.fillStyle = 'red';
	ctx.fillRect(posX, posY, gridSize, gridSize);

	ctx.strokeStyle = '#000000';
	ctx.lineWidth = gridStroke;
	ctx.strokeRect(posX, posY, gridSize, gridSize);
}

function Grids(options) {
	this.width = 1;
	this.height = 1;
	this.posX = null;
	this.posY = null;

	for(var n in options) {
		this[n] = options[n];
	}

	this.init = function() {
		console.log('new grid init');
		var numberX = this.width;
		var numberY = this.height;
		var posX = this.posX;
		var posY = this.posY;

		for(var i = 0; i < numberX; i++) {
			for(var j = 0; j < numberY; j++) {
				drawGrid(posX + i * gridSize, posY + j * gridSize);
			}
		}
	};

	this.init();
}


var grid = new Grids({height: 2, width: 5, posX: 50, posY: 50});