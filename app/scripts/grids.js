'use strict';

function Grids() {
	this.width = 1;
	this.height = 1;

	for(var n in arguments[0]) {
		this[n] = arguments[0][n];
	}
}

var grid = new Grids({height: 5, width: 6});