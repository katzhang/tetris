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
    }
    console.log(e.keyCode);
}, false);

function moveToSide(obj, ifToLeft) {
	var left = obj.canvas.style.left;
	left = left ? parseInt(left.replace('px', '')) : 0;
	left = (ifToLeft ? (left - 10) : (left + 10)) + 'px';
	obj.canvas.style.left = left;
}
