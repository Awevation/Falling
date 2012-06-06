//constants
var gravity = -2;
var friction = 4;
var cloudVel = 10;
var PLAYER_MAX_AIR_XV = 50;
var PLAYER_MAX_AIR_YV; //TODO
var PLAYER_MAX_CLOUD_XV = 50;
var PLAYER_AIR_XV = 2;
var PLAYER_CLOUD_XV = 7;

function collides(a, b) {
    return a.xPos < b.xPos + b.width &&
	   a.xPos + a.width > b.xPos &&
	   a.yPos < b.yPos + b.height &&
	   a.yPos + a.height > b.yPos;
}

function xOverlap(a, b) {
    if(a.xPos < b.xPos && a.xPos + a.width > b.xPos) {
	return a.xPos + a.width - b.xPos;
    } else if (a.xPos + a.width > b.xPos + b.width && a.xPos < b.xPos + b.width) {
	return b.xPos + b.width - a.xPos;
    } else if (a.xPos > b.xPos && a.xPos + a.width < b.xPos + b.width) {
	return true;
    } else if (a.xPos + a.width < b.xPos || a.xPos > b.xPos + b.width) {
	return false;
    }
}

//checks whether a is in b
function within(a, b) {
    return a.xPos < b.xPos + b.width &&
	   a.xPos > b.xPos &&
	   a.yPos + a.height < b.yPos + b.height &&
	   a.yPos > b.yPos; 
}

//Not Physics per se, but whatever
function Point(x, y) {
    this.x = x;
    this.y = y;
}

