function Camera() {
    this.xPos = 0.0;
    this.yPos = 0.0;
    this.xVel = 0.0;
    this.yVel = 0.0;
    this.width = 400;
    this.height = 600;
    //Bounding box inside which the player can freely move without moving this
    this.bBox = new BoundingBox(100, 133, 100, 400);

    this.update = function(dt, player) {
	this.alignBBox();
	/*if(player.xPos + player.width > this.bBox.xPos + this.bBox.width) {
		//then we're on the right
		this.xVel += Math.abs(player.xVel);
	    } else if(player.xPos < this.bBox.xPos) {
		//then we're on the left
		this.xVel -= Math.abs(player.xVel);
	    }

	    if(player.yPos + player.height > this.bBox.yPos + this.bBox.height) {
		//then we're above it
		this.yVel += Math.abs(player.yVel)
	    } else if (player.yPos < this.bBox.yPos) {
		//we're bellow
		this.yVel -= Math.abs(player.yVel);
	    }*/

	if(!within(player, this.bBox)) {
	    this.xVel = player.xVel;
	    this.yVel = player.yVel;
	}

	this.xPos += (this.xVel * dt) / 1000.0;
	this.yPos += (this.yVel * dt) / 1000.0;

	if(within(player, this.bBox)) {
	    this.xVel = 0;
	    this.yVel = 0;
	}
    }

    this.alignBBox = function() {
	this.bBox.xPos = this.xPos + this.bBox.xOff;
	this.bBox.yPos = this.yPos + this.bBox.yOff;
    }
}
