var gravity = -2;

function collides(a, b) {
    return a.xPos < b.xPos + b.width &&
	a.xPos + a.width > b.xPos &&
	a.yPos < b.yPos + b.height &&
	a.yPos + a.height > b.yPos;
}

