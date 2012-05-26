function Cloud(width, height, xPos, yPos, speed) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVel = speed; //cloudVel;
    this.yVel = 0;
    this.width = width;
    this.height = height;
    this.tag = "cloud";
    this.bBoxes = new Array();
    this.texture = res.textures.cloud

    this.update = function(world, dt) {
	this.xPos += (this.xVel * dt) / 1000.0;
	this.yPos += (this.yVel * dt) / 1000.0;
	this.alignBBoxes();
    }
}

Cloud.prototype = new Quad();
Cloud.prototype.constructor = Cloud;
