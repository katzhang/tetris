'use strict';
var container = document.querySelector('.board');
var boardSizes = {
	'large': [15, 30],
	'small': [20, 15]
}

function Board(options) {
	this.size = 'large';
	this.height = null;
	this.width = null;
	this.boardSizes = {
		'large': [15, 30],
		'small': [20, 15]
	}

	this.filledPoints = [];
	this.filledLines = {};

	for(var n in options) {
		this[n] = options[n];
	}

	this.init = function() {
		var size = this.size;
		var sizes = this.boardSizes;
		this.width = sizes[size][0];
		this.height = sizes[size][1];
		container.style.width = sizes[size][0] * GRID_SIZE + 'px';
		container.style.height = sizes[size][1] * GRID_SIZE + 'px';

		for(var i = -5; i < this.height; i++) {
			this.filledLines[i] = [];
		};

		var canvas = document.querySelector('.board-canvas');
		var ctx = canvas.getContext('2d');
		canvas.width = sizes[size][0] * GRID_SIZE;
		canvas.height = sizes[size][1] * GRID_SIZE;
		this.canvas = canvas;
		this.ctx = ctx;
	}

	this.init();


}

var board = new Board({size: 'large'});