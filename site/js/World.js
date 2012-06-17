function World() {
    this.entities = new Array();

    this.camera = new Camera();

    //make the sky, load the sky texture
    this.sky = new Sky(400, 600, 0, 0);
    this.sky.bufferUp();

    //the area to render around the player
    this.renderZone = new BoundingBox(-1000, -1000, 1000, 1000);

    this.pushEntity = function(entity) {
	this.entities.push(entity);
    }

    this.popEntity = function(entity) {
	this.entities.pop(entity);
    }

    this.update = function(dt) {
	for(entity in this.entities) {
	    this.entities[entity].update(this, dt);
	    //if it's the player, center the sky + camera around the player!
	    if(this.entities[entity].tag === "player") {
		this.camera.update(dt, player);
		this.sky.update(this.camera);
		this.renderZone.xPos = this.entities[entity].xPos + this.renderZone.xOff;
		this.renderZone.width = this.renderZone.xPos + this.renderZone.width - this.renderZone.xOff;
		this.renderZone.yPos = this.entities[entity].yPos + this.renderZone.yOff;
		this.renderZone.height = this.renderZone.yPos + this.renderZone.width - this.renderZone.yOff;
	    }
	}

	//TODO Possibly generate some clouds. Possibly don't.
	
    }

    this.draw = function(posAttribute, texAttribute) {
	this.sky.draw(posAttribute, texAttribute);
	for(entity in this.entities) {
	    if(collides(this.entities[entity], this.renderZone)) {
		this.entities[entity].draw(posAttribute, texAttribute);
		if(keydown.z) {
		    for(var i = 0; i < this.entities[entity].bBoxes.length; i++) {
			this.entities[entity].bBoxes[i].draw(posAttribute, texAttribute);
		    }
		}
	    }
	}
    }


    this.collision = function(entity) {

	for(entity2 in this.entities) {

	    for(bBox in this.entities[entity2].bBoxes) {

		for(bBox2 in entity.bBoxes) {

		    if(entity.bBoxes[bBox2].entityTag != this.entities[entity2].tag) {

			if(collides(entity.bBoxes[bBox2], this.entities[entity2].bBoxes[bBox])) {
			    //pass in the number of the bounding box of the entity we're checking, my replacement to a pointer. Yes I hate JS. 
			    entity.recCollision(entity2, bBox2, bBox);
			    return true;
			}
		    }
		}
	    }
	}
	return false;
    }

    this.xOverlap = function(entity) {
	return false;
    }

    this.genClouds = function(player) {
	//generates points within a +- radius of 1000 from the given player
	var points = this.genPoints(250, player.xPos - 5000, player.xPos + 5000, player.yPos - 5000, player.yPos + 5000);
	for(var i = 0; i < points.length; i++) {
	    this.makeCloud(points[i]);
	}
    }

    this.makeCloud = function(point) {
	var width = 100;
	var height = 100;
	var speed = Math.floor(Math.random() * 20);
	var cloud = new Cloud(width, height, point.x, point.y, speed);
	
	cloud.bufferUp();
	cloud.loadBBox(new BoundingBox(12, 40, 77, 24));
	cloud.alignBBoxes();

	this.entities.push(cloud);
    }
    
    //It errr.... generates some noise, used to map the clouds. Get ready for Milo Mordaunt's patented (super awesome) noise generator he's about to freestyle.
    //Wish me luck!
    this.genPoints = function(numPoints, minX, maxX, minY, maxY) {
	var points = new Array();
	var xTemp = 0;
	var yTemp = 0;

	for(var i = 0; i < numPoints; i++) {
	    xTemp = Math.floor(Math.random() * maxX) + minX;
	    yTemp = Math.floor(Math.random() * maxY) + minY;
	    points.push(new Point(xTemp, yTemp));
	}

	return points;
    }
}
