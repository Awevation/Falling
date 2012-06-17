function Player(width, height, xPos, yPos) {
    this.width = width;                 
    this.height = height;
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVel = 0;
    this.yVel = 0;
    this.frame = 0;
    this.blurFactorH = 0.000;
    this.blurFactorV = 0.000;
    this.tag = "player";
    this.bBoxes = new Array();
    this.texCo = new Array();
    this.texture = res.textures.player;
    this.cloudOn;
    this.states = {
	UMB_OPEN: false, 
	SLIDING: false, 
	JUMPING: false,
	ONCLOUD: false
    }

    this.handleEvents = function() {
	//TODO cap x movement, with UMB_OPEN respecting.
	if (keydown.left && !this.states.ONCLOUD) {
	    this.xVel -= PLAYER_AIR_XV;
	} else if (keydown.right && !this.states.ONCLOUD) {
	    this.xVel += PLAYER_AIR_XV;
	} else if (keydown.left && this.states.ONCLOUD) {
	    this.xVel -= PLAYER_CLOUD_XV;
	} else if (keydown.right && this.states.ONCLOUD) {
	    this.xVel += PLAYER_CLOUD_XV;
	} else if (keydown.up && this.states.ONCLOUD) {
	    this.yVel += 150;
	    this.states.JUMPING = true;
	} else if (keydown.space) {
	    this.states.UMB_OPEN = true;
	} else if (!keydown.space) {
	    this.states.UMB_OPEN = false;
	}
    }

    this.updateTexture = function(frameNum) {
	//TODO add proper Animation support
	if(this.states.UMB_OPEN) {
		this.texCo = [
		    0.0,        0.0,
		    0.0,        1.0,
		    1/frameNum, 0.0,
		    1/frameNum, 1.0
		];
	} else if (!this.states.UMB_OPEN) {
		  this.texCo = [
		      1/frameNum,       0.0,
		      1/frameNum,       1.0,
		      2 * 1/frameNum,   0.0,
		      2 * 1/frameNum,  1.0
	          ];
	}
    }
    
    this.update = function(world, dt) {
	this.updateTexture(2);
	this.handleEvents();

	//handle the boundingBox selection
	if(this.states.UMB_OPEN) {
	    this.deleteBBoxes();
	    this.loadBBox(new BoundingBox(22, 0, 37, 76));
	    var bBoxUmb = new BoundingBox(28, 83, 58, 16);
	    bBoxUmb.setTag("umbrella");
	    this.loadBBox(bBoxUmb);
	    for(bBox in this.bBoxes) {
		this.bBoxes[bBox].setSet("playerOpen");
	    }
	} else {
	    this.deleteBBoxes();
	    this.loadBBox(new BoundingBox(22, 0, 37, 76));
	    this.loadBBox(new BoundingBox(45, 59, 14, 40));
	    for(bBox in this.bBoxes) {
		this.bBoxes[bBox].setSet("playerClosed");
	    }   
	}

	if(this.states.JUMPING) {
	    this.states.ONCLOUD = false;
	}

	this.xPos += this.xVel * dt;
	this.alignBBoxes();

	//check for horizontal collision, act on it
	if(world.collision(this)) {
	    if(this.bBoxes[this.bBoxCol].xPos < world.entities[this.cloudOn].bBoxes[this.bBoxColW].xPos) {
		this.xPos -= xOverlap(this.bBoxes[this.bBoxCol], world.entities[this.cloudOn].bBoxes[this.bBoxColW]);
		this.xVel = world.entities[this.cloudOn].xVel;
	    } else {
		this.xPos += xOverlap(this.bBoxes[this.bBoxCol], world.entities[this.cloudOn].bBoxes[this.bBoxColW]);
		this.xVel = world.entities[this.cloudOn].xVel;
	    }
	    this.alignBBoxes();
	}

	this.yPos += this.yVel * dt;
	this.alignBBoxes();

	//check for vertical collision, act on it
	if(world.collision(this)) {
    	    this.yPos -= this.yVel * dt;
	    this.yVel = 0;
	    this.alignBBoxes();
	    if(this.bBoxes[this.bBoxCol].tag != "umbrella") {
		this.states.ONCLOUD = true;
	    }
	    this.states.JUMPING = false;
	}

	//for friction...
	if(this.states.ONCLOUD) {
	    if(this.xVel > world.entities[this.cloudOn].xVel) {
		this.xVel -= friction;
	    } else if (this.xVel < world.entities[this.cloudOn].xVel) {
		this.xVel += friction;
	    }
	}

	if(!this.states.ONCLOUD) {
	    if(this.states.UMB_OPEN) {
		if(this.yVel > -50) { //cap gravity, air resistance
	    	    this.yVel += gravity;
		} else {
		    this.yVel -= gravity * 10;
		}
	    } else {
		if(this.yVel > -500) {
		    this.yVel += gravity;
		} else {
		    this.yVel -= gravity;
		}
	    }
	}

	if(this.states.ONCLOUD) {
	    //check if you're *really* all that ONCLOUD
	    if(xOverlap(this.bBoxes[this.bBoxCol], world.entities[this.cloudOn].bBoxes[this.bBoxColW]) === false) {
		//nope
		this.states.ONCLOUD = false;
	    }
	}

	//figure out how much blur to blur with
	this.blurFactorH = this.xVel / 10000.0;
    	this.blurFactorV = this.yVel / 10000.0;
	console.log(this.xPos + ", " + this.yPos);
    }

    this.uDraw = function(posAttribute, texAttribute) {
	gl.uniform1f(gl.getUniformLocation(shaderProgram, "hAmount"), this.blurFactorH);
	gl.uniform1f(gl.getUniformLocation(shaderProgram, "vAmount"), this.blurFactorV);
    }

    this.recCollision = function(entity, thisbBoxNum, bBox2) {
	this.cloudOn = entity;
	//genius and syntactically horrible replacements for pointers, they're just integers, the array index of the object
	this.bBoxCol = thisbBoxNum;
	this.bBoxColW = bBox2;
    }
}

Player.prototype = new Quad();
Player.prototype.constructor = Player;
