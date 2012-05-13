/*Used as the basis fro pretty much everything.
 * Under BSD License, Copyright 2012 Milo Mordaunt*/
function Quad() {
    var verticesBuffer;
    var textureBuffer;
    var indexBuffer;
    var vertices;
    var indicies;
    this.xPos;
    this.yPos;
    this.xVel;
    this.yVel;
    var texCo;
    var texture;
    this.frame = 0;
    this.width;
    this.height;
    this.tag;
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

	vertices = [
	    0.0, 	this.height, 0.0,
	    0.0, 	0.0, 	     0.0,
	    this.width, this.height, 0.0,
	    this.width, 0.0, 	     0.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	textureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);

	texCo = [
	    0.0, 0.0,
	    0.0, 1.0,
	    1.0, 0.0,
	    1.0, 1.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCo), gl.STATIC_DRAW);

	indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

	indices = [
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

	gl.uniform1i(gl.getUniformLocation(shaderProgram, "horizontal"), false);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0);

	this.uDraw(posAttribute, textureAttribute);

	//pop back to old matrix
	mvPopMatrix();                      
    };
    this.uDraw = function(posAttr, texAttr) { //because there's no real concept of a 'super' call in JS, specific objects can draw what they want
    };
    this.loadTexture = function(src) {
	texture = textureLoader.load(src, function(texture){
	    //handler
	});
    };
    this.loadBBox = function(BoundingBox) {
	BoundingBox.setTag(this.tag);
	this.bBoxes.push(BoundingBox);
    };
    this.alignBBoxes = function() {
	for(bBox in this.bBoxes) {
	    this.bBoxes[bBox].xPos = this.xPos + this.bBoxes[bBox].xOff;
	    this.bBoxes[bBox].yPos = this.yPos + this.bBoxes[bBox].yOff;
	}
    };
    this.deleteBBoxes = function(set) {
	for(bBox in this.bBoxes) {
	    if(set) {
		if(this.bBoxes[bBox].set === set) {
		    this.bBoxes.splice(bBox, 1);
		} else {
		    console.log("bBox does not exist");
		    return -1;
		}
	    } else {
		//just delete them all
		this.bBoxes.splice(bBox, 1);
	    }
	}
    };
    this.updateTexture = function(frameNum) {
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);

	this.frame++
	if(this.frame > frameNum) {
	    this.frame = 1;
	}
	switch(this.frame) {
	    case 1:
		texCo = [
		    0.0, 0.0,
		    0.0, 1.0,
		    0.5, 0.0,
		    0.5, 1.0
	        ];
	    case 2:
		  texCo = [
		      0.5, 0.0,
		      0.5, 1.0,
		      1.0, 0.0,
		      1.0, 1.0
		   ];
	}

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCo), gl.STATIC_DRAW);

    }
}
