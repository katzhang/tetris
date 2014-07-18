'use strict';

window.addEventListener('keydown', function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

    switch(e.keyCode) {
    	case 39:
    		if(currentGrid.validate(1,0)) {
    			moveToSide(currentGrid, false);
    		}
    		break;

    	case 37:
    		if(currentGrid.validate(-1,0)) {
    			moveToSide(currentGrid, true);
    		}
    		break;
    	case 38:
    		if(currentGrid.validate(0,0,true)) {
    			rotate(currentGrid);
    		}
    		break;
      	case 40:
    		if(currentGrid.validate(0,1)) {
    			currentGrid.fps = 20;
    		}
    		break;

    }
}, false);

window.addEventListener('keyup', function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

    if(e.keyCode === 40) {
    	currentGrid.fps = 2;
    }
}, false);

function moveToSide(obj, ifToLeft) {
	//increase count
	obj.moveToSideCount++;

	var left = obj.canvas.style.left;
	left = left ? parseInt(left.replace('px', '')) : 0;
	left = (ifToLeft ? (left - GRID_SIZE) : (left + GRID_SIZE)) + 'px';
	obj.canvas.style.left = left;

	if(ifToLeft) {
		obj.posX--;
	} else {
		obj.posX++;
	}

}

function rotateShapePoints(array) {
	var output = new Array(array[0].length);

	for(var k = 0; k < output.length; k++) {
		output[k] = [];
	}

	for(var i = 0; i < array.length; i++) {
		for(var j = 0; j < array[i].length; j++) {
			output[j].unshift(array[i][j]);
		}
	}

	return output;
}

function rotate(obj) {
	//increase count
	obj.rotateCount++;

	var height = obj.height;
	var width = obj.width;
	var points = obj.points;
	var shapePoints = obj.shapePoints;
	var posX = obj.posX;
	var posY = obj.posY;
	var ctx = obj.ctx;
	var color = obj.color;
	var canvas = obj.canvas;

	//Clear canvas for redrawing
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.height = width * GRID_SIZE;
	canvas.width = height * GRID_SIZE;

	//Update shapePoints
	var newShapePoints = rotateShapePoints(shapePoints);

	for(var i = 0; i < newShapePoints.length; i++) {
		for(var j = 0; j < newShapePoints[i].length; j++) {
			if(newShapePoints[i][j]) {
				drawGrid((0 + j) * GRID_SIZE, (0 + i) * GRID_SIZE, ctx, color);
			}
		}
	}

	obj.canvas = canvas;
	obj.shapePoints = newShapePoints;

	//change grid's height and width
	obj.width = height;
	obj.height = width;
}