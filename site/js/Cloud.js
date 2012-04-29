function Cloud(width, height, xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVel = 10;
    this.yVel = 0;
    this.width = width;
    this.height = height;
    this.bBoxes = new Array();

    this.update = function(world, dt) {
	this.xPos += (this.xVel * dt) / 1000.0;
	this.yPos += (this.yVel * dt) / 1000.0;
	this.alignBBoxes();
    }
}

Cloud.prototype = new Quad();
Cloud.prototype.constructor = Cloud;
