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
	//increase count
	obj.moveToSideCount++;

	var left = obj.canvas.style.left;
	left = left ? parseInt(left.replace('px', '')) : 0;
	left = (ifToLeft ? (left - gridSize) : (left + gridSize)) + 'px';
	obj.canvas.style.left = left;

}

function rotate(obj) {
	//increase count
	obj.rotateCount++;

	var height = obj.height;
	var width = obj.width;
	var rotate = obj.canvas.style.webkitTransform;
	rotate = rotate ? parseInt(rotate.replace(/^\D+/g, '')) : 0;
	rotate = rotate + 90;
	obj.canvas.style.webkitTransform = 'rotate(' + rotate + 'deg)';

	var left = obj.canvas.style.left;
	var top = obj.canvas.style.top;
	left = left ? parseInt(left.replace('px', '')) : 0;
	top = top ? parseInt(top.replace('px', '')) : 0;
	//todo: always centered: horizontal
	left = (left - gridSize/2) + 'px';
	obj.canvas.style.left = left;

	//always centered: vertical
	console.log(top);
	top = (top - gridSize/2) + 'px';
	obj.canvas.style.top = top;

	//change grid's height and width
	obj.width = height;
	obj.height = width;
}