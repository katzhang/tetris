'use strict';

window.addEventListener('keydown', function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

    console.log(currentGrid.posX);

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

	// var rotate = obj.canvas.style.webkitTransform;
	// rotate = rotate ? parseInt(rotate.replace(/^\D+/g, '')) : 0;
	// rotate = rotate + 90;
	// console.log(obj.canvas.style);
	// obj.canvas.style.webkitTransform = 'rotate(' + rotate + 'deg)';
	// obj.canvas.style.webkitTransformOrigin = '0 0';

	// var left = obj.canvas.style.left;
	// var top = obj.canvas.style.top;
	// left = left ? parseInt(left.replace('px', '')) : 0;
	// top = top ? parseInt(top.replace('px', '')) : 0;

	//always centered: horizontal
	// if(obj.rotateCount % 2) {
	// 	left = left + gridSize;
	// } else {
	// 	left = left - gridSize;
	// }
	// left = left + 'px';
	// obj.canvas.style.left = left;

	//Clear canvas for redrawing
	console.log('canvas old width: ' + canvas.width);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.height = width * gridSize;
	canvas.width = height * gridSize;

	//Update shapePoints
	var newShapePoints = rotateShapePoints(shapePoints);

	console.log(newShapePoints);

	for(var i = 0; i < newShapePoints.length; i++) {
		for(var j = 0; j < newShapePoints[i].length; j++) {
			if(newShapePoints[i][j]) {
				console.log(ctx);
				console.log(posX);
				drawGrid((0 + j) * gridSize, (0 + i) * gridSize, ctx, color);
			}
		}
	}

	obj.canvas = canvas;


	//always centered: vertical
	// if(obj.rotateCount % 2) {
	// 	console.log('odd number');
	// 	top = (top + gridSize/2) + 'px';
	// 	obj.canvas.style.top = top;
	// }

	//change grid's height and width
	obj.width = height;
	obj.height = width;
}