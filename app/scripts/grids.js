'use strict';

//global variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

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
		ctx.fillRect(this.posX, this.posY, this.width, this.height);
	};

	this.init();
}


var grid = new Grids({height: 20, width: 100, posX: 50, posY: 50});