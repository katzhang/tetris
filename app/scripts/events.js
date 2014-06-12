'use strict';
var originalPosY = 50;
window.addEventListener('keydown', function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
    console.log(e.keyCode);
    ctx.clearRect(50 - gridStroke, 50 - gridStroke, 2 * gridSize + gridStroke*2, 3 * gridSize + gridStroke*2);
    originalPosY += 10;
    new Grids({shape: shapesPool[6], posX: 50, posY: originalPosY});
}, false);
