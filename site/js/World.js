function World() {
    this.entities = new Array();

    //make the sky, load the sky texture
    this.sky = new Sky(400, 600, 0, 0);
    this.sky.loadTexture("../images/sky.png");
    this.sky.bufferUp();

    this.pushEntity = function(entity) {
	this.entities.push(entity);
    }

    this.popEntity = function(entity) {
	this.entities.pop(entity);
    }

    this.update = function(dt) {
	for(entity in this.entities) {
	    this.entities[entity].update(this, dt);

	    //if it's the player, center the sky around the player!
	    if(this.entities[entity].tag === "player") {
		this.sky.update(player);
	    }
	}
    }

    this.draw = function(posAttribute, texAttribute) {
	this.sky.draw(posAttribute, texAttribute);
	for(entity in this.entities) {
	    this.entities[entity].draw(posAttribute, texAttribute);
	}
    }


    this.collision = function(entity) {

	for(entity2 in this.entities) {

	    for(bBox in this.entities[entity2].bBoxes) {

		for(bBox2 in entity.bBoxes) {

		    if(entity.bBoxes[bBox2].tag != this.entities[entity2].tag) {

			if(collides(entity.bBoxes[bBox2], this.entities[entity2].bBoxes[bBox])) {
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

    this.genCloud = function() {
	var width = 100;
	var height = 100;
	var xPos = Math.floor(Math.random() * 401);
	var yPos = Math.floor(Math.random() * 601);
	var cloud = new Cloud(width, height, xPos, yPos);
	
	cloud.loadTexture("../images/cloud.png");
	cloud.bufferUp();
	cloud.loadBBox(new BoundingBox(5, 32, 91, 38));
	cloud.alignBBoxes();

	this.entities.push(cloud);
    }

    this.setCamera = function() {
	mvMatrix();
    }
}
