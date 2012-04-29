function World() {
    this.entities = new Array();

    this.pushEntity = function(entity) {
	this.entities.push(entity);
    }

    this.popEntity = function(entity) {
	this.entities.pop(entity);
    }

    this.update = function(dt) {
	for(entity in this.entities) {
	    this.entities[entity].update(this, dt);
	}
    }

    this.draw = function(posAttribute, texAttribute) {
	for(entity in this.entities) {
	    this.entities[entity].draw(posAttribute, texAttribute);
	}
    }


    this.collision = function(bBox) {
	for(entity in this.entities) {
	    for(bBox2 in this.entities[entity].bBoxes) {
		if(bBox != this.entities[entity].bBoxes[bBox2]) {
		    if(collides(bBox, this.entities[entity].bBoxes[bBox2])) {
			return true;
		    }
		}
	    }
	}
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
	cloud.loadBBox(new BoundingBox(0, 38, 81, 40));
	cloud.alignBBoxes();

	this.entities.push(cloud);
    }
}
