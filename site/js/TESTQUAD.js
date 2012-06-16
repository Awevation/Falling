function TESTQUAD(width, height, xPos, yPos, speed, tex) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVel = speed; //cloudVel;
    this.yVel = 0;
    this.width = width;
    this.height = height;
    this.tag = "cloud";
    this.bBoxes = new Array();
    this.texture = tex;
}

TESTQUAD.prototype = new Quad();
TESTQUAD.prototype.constructor = TESTQUAD;

