'use strict';
var container = document.querySelector('.board');
var boardSizes = {
	'large': [15, 30],
	'small': [20, 15]
}

container.style.width = boardSizes.large[0] * gridSize + 'px';
container.style.height = boardSizes.large[1] * gridSize + 'px';