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
    this.cloudOn;

    this.handleEvents = function() {
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

	this.yVel += -2;

    }
    
    this.update = function(world, dt) {
	this.handleEvents();

	this.xPos += (this.xVel * dt) / 1000.0;

	//check for horizontal collision, act on it
	for(bBox in this.bBoxes) {
	    if(world.collision(this.bBoxes[bBox])) {
		this.xPos -= (this.xVel * dt) / 1000.0;
		this.xVel = 0;
		this.onCloud = false;
		console.log("horCol!!");
	    }
	}

	this.yPos += (this.yVel * dt) / 1000.0;

	//check for vertical collision, act on it
	for(bBox in this.bBoxes) {
	    if(world.collision(this.bBoxes[bBox])) {
		this.yPos -= (this.yVel * dt) / 1000.0;          
		this.yVel = 0;
		this.onCloud = true;
	    }
	}


	this.alignBBoxes();

    }
}
