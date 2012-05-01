Sky.prototype = new Quad();
Sky.prototype.constructor = Sky;

function Sky(width, height, xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVel = 0;
    this.yVel = 0;
    this.width = width;
    this.height = height;
    this.tag = "sky";
}

