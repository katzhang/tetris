'use strict';

window.addEventListener('keydown', function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

    switch(e.keyCode) {
    	case 39:
    		moveToSide(grid, false);
    		break;

    	case 37:
    		moveToSide(grid, true);
    		break;
    	case 38:
    		rotate(grid);
    		break;

    }
    console.log(e.keyCode);
}, false);

function moveToSide(obj, ifToLeft) {
	var left = obj.canvas.style.left;
	left = left ? parseInt(left.replace('px', '')) : 0;
	left = (ifToLeft ? (left - gridSize) : (left + gridSize)) + 'px';
	obj.canvas.style.left = left;
}

function rotate(obj) {
	var rotate = obj.canvas.style.webkitTransform;
	rotate = rotate ? parseInt(rotate.replace(/^\D+/g, '')) : 0;
	rotate = rotate + 90;
	obj.canvas.style.webkitTransform = 'rotate(' + rotate + 'deg)';

	var left = obj.canvas.style.left;
	left = left ? parseInt(left.replace('px', '')) : 0;
	//todo: always centered
	left = (left - gridSize/2) + 'px';
	obj.canvas.style.left = left;
}