Cloud.prototype = new Quad();
Cloud.prototype.constructor = Cloud;

function Cloud(width, height, xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVel = 10;
    this.yVel = 0;
    this.width = width;
    this.height = height;
}
