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
    return a.xPos < b.xPos + b.width &&
	   a.xPos + a.width > b.xPos;
}
