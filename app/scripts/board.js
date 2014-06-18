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

	for(var n in options) {
		this[n] = options[n];
	}

	this.init = function() {
		var size = this.size;
		var sizes = this.boardSizes;
		this.width = sizes[size][0] * gridSize;
		this.height = sizes[size][1] * gridSize;
		container.style.width = sizes[size][0] * gridSize + 'px';
		container.style.height = sizes[size][1] * gridSize + 'px';
	}

	this.init();


}

var board = new Board({size: 'large'});