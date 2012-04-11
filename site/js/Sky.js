Sky.prototype = new Quad();
Sky.prototype.constructor = Sky;

function Sky(width, height, xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVel = 0;
    this.yVel = 0;
    this.width = width;
    this.height = height;
    this.clouds = new Array();

    this.genCloud = function() {
	var width = 100;
	var height = 100;
	var xPos = Math.floor(Math.random() * 401);
	var yPos = Math.floor(Math.random() * 601);
	this.clouds.push( new Cloud(width, height, xPos, yPos) );
        this.clouds[this.clouds.length - 1].loadTexture("../images/cloud.png");
	this.clouds[this.clouds.length - 1].bufferUp();
    }

    this.update = function(dt) {
	for (var i=0; i < this.clouds.length; i++) {
	    this.clouds[i].update(dt);
	}
    }

    this.uDraw = function(posAttr, texAttr) {
	for (var i=0; i < this.clouds.length; i++) {
	    this.clouds[i].draw(posAttr, texAttr);
	}
    }
}

