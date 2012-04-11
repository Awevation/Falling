//The Block object, a tile that is used to build bigger blocks
function Quad() {
    var verticesBuffer;
    var textureBuffer;
    var indexBuffer;
    this.xPos;
    this.yPos;
    this.xVel;
    this.yVel;
    var image;
    var texture;
    this.width;
    this.height;
    this.bBoxes = new Array();

    this.setX = function(x) {
	this.xPos = x;
    };
    this.setY = function(y) {
	this.yPos = y;
    };
    this.bufferUp = function() {
	verticesBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

	var vertices = [
	    0.0, 	this.height, 0.0,
	    0.0, 	0.0, 	     0.0,
	    this.width, this.height, 0.0,
	    this.width, 0.0, 	     0.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	textureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);

	var texCo = [
	    0.0, 0.0,
	    0.0, 1.0,
	    1.0, 0.0,
	    1.0, 1.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCo), gl.STATIC_DRAW);

	indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

	var indices = [
	    0, 1, 2, 3
	    ];

	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    };
    this.update = function(delta) {
	this.xPos += (this.xVel * delta) / 1000.0;
	this.yPos += (this.yVel * delta) / 1000.0;
    };
    this.draw = function(posAttribute, textureAttribute) {
	mvPushMatrix();

	mvTranslate([this.xPos, this.yPos, 0.0]);

	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
	gl.vertexAttribPointer(posAttribute, 3, gl.FLOAT, false, 0, 0);

  	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.vertexAttribPointer(textureAttribute, 2, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0);

	this.uDraw(posAttribute, textureAttribute);

	//pop back to old matrix
	mvPopMatrix();                      
    };
    this.uDraw = function(posAttr, texAttr) { //because there's no real concept of a 'super' call in JS, specific objects can draw what they want
    };
    var initTexture = function (image, texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
    };
    this.loadTexture = function(src) {
	image = new Image();
	texture = gl.createTexture();
	image.onload = function() {
	    initTexture(image, texture);
	}
	image.src = src;
    };
    this.loadBBox = function(BoundingBox) {
	this.bBoxes.push(BoundingBox);
    };
    this.alignBBoxes = function() {
	for(var i  = 0; i < this.bBoxes.length; i++) {
	    this.bBoxes[i].xPos = this.xPos + this.bBoxes[i].xOff;
	    this.bBoxes[i].yPos = this.yPos + this.bBoxes[i].yOff;
	}
    }
}
