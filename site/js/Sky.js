Sky.prototype = new Quad();
Sky.prototype.constructor = Sky;

function Sky(width, height, xPos, yPos) {
    this.xPos = 0;
    this.yPos = 0;
    this.xVel = 0;
    this.yVel = 0;
    this.width = 400;
    this.height = 600;
    this.tag = "sky";
    this.texture = res.textures.sky;

    //update the sky so it is around the camera!
    this.update = function(camera) {
	this.xPos = camera.xPos; 
	this.yPos = camera.yPos;
    }
}
