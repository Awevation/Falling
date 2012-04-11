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
    this.verCol = false;
    this.cloudOn;
    
    this.update = function(delta) {
	this.xPos += (this.xVel * delta) / 1000.0;
	this.yPos += (this.yVel * delta) / 1000.0;

	this.alignBBoxes();

	if(this.verCol) {
	    this.yPos -= (this.yVel * delta) / 1000.0;
	    this.yVel = 0;
	    this.verCol = false;
	    this.onCloud = true;
	} else if (this.horCol) {
	    this.xPos -= (this.xVel * delta) / 1000.0;
	    this.xVel = 0;
	    this.yVel += -2;
	    this.horCol = false;
	    this.onCloud = false;
	} 
	if(!this.onCloud) {
	    this.yVel += -2;
	}
	if (keydown.left && !this.onCloud) {
	    this.xVel += -2;
	} else if (keydown.right && !this.onCloud) {
	    this.xVel += 2;
	} else if (keydown.left && this.onCloud) {
	    this.xVel += -6;
	} else if (keydown.right && this.onCloud) {
	    this.xVel += 6;
	} else if (keydown.up && this.onCloud) {
	    this.yVel += 10;
	}
    }
    this.handleCollision = function(a, b) {
	var xOverlap;
	var yOverlap;
	if(a.xPos + a.width < b.xPos + b.width && a.yPos > b.yPos) {
	    xOverlap = a.xPos + a.width - b.xPos;
	    yOverlap = b.yPos + b.height - a.yPos;
	} else if (a.xPos + a.width < b.xPos + b.width && a.yPos < b.yPos) {
	    xOverlap = a.xPos + a.width - b.xPos;
	    yOverlap = a.yPos + a.height - b.yPos;
	} else if (a.xPos + a.width > b.xPos + b.width && a.yPos > b.yPos) {
	    xOverlap = b.xPos + b.width - a.xPos;
	    yOverlap = b.yPos + b.height - a.yPos;
	} else if (a.xPos + a.width > b.xPos + b.width && a.yPos < b.yPos) {
	    xOverlap = b.xPos + b.width - a.xPos;
	    yOverlap = a.yPos + a.height - b.yPos;
	} else {
	    //Christ knows what's happening. Bail. Bail. Bail.
	    console.log("ERROR");
	    return 0;
	}
	if(xOverlap > yOverlap) {
	    this.verCol = true;
	    this.cloudOn = b;
	} else {
	    this.horCol = true;
	}
    }
    this.collides = function(a, b) {
	return a.xPos < b.xPos + b.width &&
	    a.xPos + a.width > b.xPos &&
	    a.yPos < b.yPos + b.height &&
	    a.yPos + a.height > b.yPos;
    }
    this.isOnCloud = function(cloud) {
	return this.xPos < cloud.xPos  + cloud.width &&
 	       this.xPos + this.width  > cloud.xPos &&
	       this.yPos < cloud.yPos  + cloud.height &&
	       this.yPos + this.height > cloud.yPos;
    }
}
