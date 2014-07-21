'use strict';

window.addEventListener('keydown', function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

    switch(e.keyCode) {
    	case 39:
    		if(currentTetromino.valid(1,0)) {
    			moveToSide(currentTetromino, false);
    		}
    		break;

    	case 37:
    		if(currentTetromino.valid(-1,0)) {
    			moveToSide(currentTetromino, true);
    		}
    		break;
    	case 38:
    		if(currentTetromino.valid(0,0,true)) {
    			rotate(currentTetromino);
    		}
    		break;
      	case 40:
    		if(currentTetromino.valid(0,1)) {
    			currentTetromino.fps = 20;
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
    	currentTetromino.fps = 2;
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

function rotate(obj) {
	//increase count
	obj.rotateCount++;

	var height = obj.height;
	var width = obj.width;
	var points = obj.points;
	var points = obj.points;
	var posX = obj.posX;
	var posY = obj.posY;
	var ctx = obj.ctx;
	var color = obj.color;
	var canvas = obj.canvas;

	//Clear canvas for redrawing
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.height = width * GRID_SIZE;
	canvas.width = height * GRID_SIZE;

	//Update points
	var newPoints = obj.rotatePoints(points);

	for(var i = 0; i < newPoints.length; i++) {
		for(var j = 0; j < newPoints[i].length; j++) {
			if(newPoints[i][j]) {
				obj.drawGrid((0 + j) * GRID_SIZE, (0 + i) * GRID_SIZE, ctx, color);
			}
		}
	}

	obj.canvas = canvas;
	obj.points = newPoints;

	//change grid's height and width
	obj.width = height;
	obj.height = width;
}