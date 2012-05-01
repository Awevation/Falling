function BoundingBox(xOff, yOff, width, height) {
    this.xOff = xOff;
    this.yOff = yOff;
    this.xPos = 0;
    this.yPos = 0;
    this.width = width;
    this.height = height;
    this.tag = "";
    this.set = "";

    this.setTag = function(tag) {
	this.tag = tag;
    }
    this.setSet = function(set) {
	this.set = set;
    } 
}
