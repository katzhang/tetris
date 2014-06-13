'use strict';

window.addEventListener('keydown', function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

    switch(e.keyCode) {
    	case 39:
    		grid = moveToSide(grid, false);
    		break;

    	case 37:
    		grid = moveToSide(grid, true);
    		break;
    }
    console.log(e.keyCode);
}, false);

function moveToSide(obj, ifToLeft) {
	var shape = obj.shape;
	var numX = shape.width;
	var numY = shape.height;
	var posX = obj.posX;
	var posY = obj.posY;
	console.log('posX: ' + posX);

	//clear canvas
	ctx.clearRect(posX - gridStroke, posY - gridStroke, numX * gridSize + 2 * gridStroke, numY * gridSize + 2 * gridStroke);
	var newPosX = posX + (ifToLeft ? -10 : 10);
	obj = new Grids({shape: shape, posX: newPosX, posY: posY});

	return obj;
}
