Player.prototype = new Quad();
Player.prototype.constructor = Player;

function Player(width, height, xPos, yPos) {
    this.width = width;                 
    this.height = height;
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVel = 0;
    this.yVel = 0;
    this.falling = true;
    this.onCloud = false;
    this.horCol = false;
    
    this.update = function(delta) {
	this.xPos += (this.xVel * delta) / 1000.0;
	this.yPos += (this.yVel * delta) / 1000.0;

	if (keydown.left && !this.onCloud) {
	    this.xVel += -2;
	} else if (keydown.right && !this.onCloud) {
	    this.xVel += 2;
	} else if (keydown.left && this.onCloud) {
	    this.xVel += -6;
	} else if (keydown.right && this.onCloud) {
	    this.xVel += 6;
	}

	if (this.onCloud) {
	    this.yPos -= (this.yVel * delta) / 1000.0;
	    this.yVel = 0;
	} else if (this.horCol) {
	    this.xPos -= (this.xVel * delta) / 1000.0;
	    this.xVel = 0;
	    this.horCol = false;
	} else {
	    this.yVel += -2;
	}

	console.log("isOnCloud: " + this.onCloud + "\nIsHorColling: " + this.horCol);
    }

    this.checkCollision = function(cloud) {
	if (this.collides(this, cloud)) {
	    this.onCloud = true;
	    return true;
	} else {
	    this.onCloud = false;
	    return false;
	}
    }
    this.collides = function(a, b) {
	return a.xPos < b.xPos + b.width &&
	    a.xPos + a.width > b.xPos &&
	    a.yPos < b.yPos + b.height &&
	    a.yPos + a.height > b.yPos;
	}
}
