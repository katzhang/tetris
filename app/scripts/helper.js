/**
 * Helper function: clone the old canvas and return the new one
 *
 * @param {element} the old canvas object
 * @returns {element} the cloned canvas object
 */
function cloneCanvas(oldCanvas) {
    var newCanvas, newCxt;

    //create a new canvas
    newCanvas = document.createElement('canvas');
    newCxt = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    newCxt.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}