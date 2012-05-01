Player.prototype = new Quad();
Player.prototype.constructor = Player;

function Player(width, height, xPos, yPos) {
    this.width = width;                 
    this.height = height;
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVel = 0;
    this.yVel = 0;
    this.onCloud = false;
    this.frame = 0;
    this.tag = "player";
    this.bBoxes = new Array();
    this.states = {UMB_OPEN: false}

    var timeout = new Timer();

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
	    this.yVel += 150;
	    this.onCloud = false;
	} else if (keydown.space) {
	    this.states.UMB_OPEN = true;
	} else if (!keydown.space) {
	    this.states.UMB_OPEN = false;
	}
    }

    this.updateTexture = function(frameNum) {
	if(this.states.UMB_OPEN) {
		texCo = [
		    0.0, 0.0,
		    0.0, 1.0,
		    0.5, 0.0,
		    0.5, 1.0
		];
	} else if (!this.states.UMB_OPEN) {
		  texCo = [
		      0.5, 0.0,
		      0.5, 1.0,
		      1.0, 0.0,
		      1.0, 1.0
	          ];
	}

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCo), gl.STATIC_DRAW);

    }

    
    this.update = function(world, dt) {
	this.updateTexture(2);
	this.handleEvents();

	//handle the boundingBox selection
	if(this.states.UMB_OPEN) {
	    this.deleteBBoxes();
	    this.loadBBox(new BoundingBox(22, 0, 37, 76));
	    this.loadBBox(new BoundingBox(28, 83, 58, 16));
	    for(bBox in this.bBoxes) {
		this.bBoxes[bBox].setSet("playerOpen");
	    }
	} else {
	    this.deleteBBoxes();
	    this.loadBBox(new BoundingBox(22, 0, 37, 76));
	    this.loadBBox(new BoundingBox(23, 59, 14, 40));
	    for(bBox in this.bBoxes) {
		this.bBoxes[bBox].setSet("playerClosed");
	    }   
	}

	this.xPos += (this.xVel * dt) / 1000.0;
	this.alignBBoxes();

	//check for horizontal collision, act on it
	for(bBox in this.bBoxes) {
	    if(world.collision(this.bBoxes[bBox])) {
		this.xPos -= (this.xVel * dt) / 1000.0;
		this.xVel = 0;
		this.onCloud = false;
		this.alignBBoxes();
		break;
	    }
	}

	this.yPos += (this.yVel * dt) / 1000.0;
	this.alignBBoxes();

	//check for vertical collision, act on it
	for(bBox in this.bBoxes) {
	    if(world.collision(this.bBoxes[bBox])) {
		this.yPos -= (this.yVel * dt) / 1000.0;	
		this.yVel = 0;
		this.onCloud = true;
		this.alignBBoxes();
		break;
	    } else {
		this.onCloud = false;
	    }
	}

	//for friction...
	if(this.onCloud) {
	    if(this.xVel > cloudVel) {
		this.xVel -= friction;
	    } else if (this.xVel < cloudVel) {
		this.xVel += friction;
	    }
	}

	if(!this.onCloud) {
	    if(this.states.UMB_OPEN) {
		if(this.yVel > -50) { //cap gravity, air resistance
	    	    this.yVel += gravity;
		} else {
		    this.yVel -= gravity;
		}
	    } else {
		if(this.yVel > -200) {
		    this.yVel += gravity;
		} else {
		    this.yVel -= gravity;
		}
	    }
	}

    }
}
