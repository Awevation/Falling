function Camera() {
    this.xPos = 0.0;
    this.yPos = 0.0;
    this.xVel = 0;
    this.yVel = 0;
    this.width = 400;
    this.height = 600;

    this.update = function(dt, player) {
	var distanceX = Math.abs((player.xPos + (player.width / 2)) - (this.xPos + (this.width / 2)));
	var distanceY = Math.abs((this.yPos + this.height / 2) - (player.yPos + player.height / 2));

	var targetX = player.xPos + (player.width / 2) - (this.width / 2);
	var targetY = player.yPos + (player.height / 2) - (this.height / 2);

	var distanceX = Math.abs((player.xPos + (player.width / 2)) - targetX);
	var distanceY = Math.abs((player.yPos + (player.height / 2)) - targetY);
	var distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));

	var vel = Math.sqrt((this.xVel) * (this.xVel) + (this.yVel * this.yVel));

	//the following was roughly transposed from one who went by the name of ajas95, I am forever in your debt, sir ajas95.
	var time90 = 0.5;
	
	var c0 = (dt * 3.75) / time90;

	if(c0 >= 1.0) {
	    this.xPos = targetX;
	    this.yPos = targetY;
	    this.xVel = 0.0;
	    this.yVel = 0.0;
	}

	var deltaX = targetX - this.xPos;
	var deltaY = targetY - this.yPos;

	var forceX = deltaX - 2.0 * this.xVel;
	var forceY = deltaY - 2.0 * this.yVel;

	this.xPos += this.xVel * c0;
	this.yPos += this.yVel * c0;

	this.xVel += forceX * c0;
	this.yVel += forceY * c0;
    }
}
