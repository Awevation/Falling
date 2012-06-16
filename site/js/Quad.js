/*Used as the basis for pretty much everything.
 * Under BSD License, Copyright 2012 Milo Mordaunt*/
function Quad() {
    this.verticesBuffer;
    this.textureBuffer;
    this.indexBuffer;
    this.vertices;
    this.indicies;
    this.xPos;
    this.yPos;
    this.xVel;
    this.yVel;
    this.texCo;
    this.texture;
    this.frame = 0;
    this.width;
    this.height;
    this.tag;
    this.texTag;
    this.bBoxes = new Array();
    //the bounding box that is collididing
    this.bBoxCol;
    //the boundning box that we are colliding with
    this.bBoxColW;

    this.setX = function(x) {
	this.xPos = x;
    };
    this.setY = function(y) {
	this.yPos = y;
    };
    this.bufferUp = function() {
	this.verticesBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);

	this.vertices = [
	    0.0, 	this.height, 0.0,
	    0.0, 	0.0, 	     0.0,
	    this.width, this.height, 0.0,
	    this.width, 0.0, 	     0.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

	this.textureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);

	this.texCo = [
	    0.0, 0.0,
	    0.0, 1.0,
	    1.0, 0.0,
	    1.0, 1.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCo), gl.STATIC_DRAW);

	this.indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

	this.indices = [
	    0, 1, 2, 3
	    ];

	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    };
    this.update = function(delta) {
	this.xPos += this.xVel * delta;
	this.yPos += this.yVel * delta;
    };
    this.draw = function(posAttribute, textureAttribute) {
	mvPushMatrix();

	mvTranslate([this.xPos, this.yPos, 0.0]);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
	gl.vertexAttribPointer(posAttribute, 3, gl.FLOAT, false, 0, 0);

  	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
	gl.vertexAttribPointer(textureAttribute, 2, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

	setMatrixUniforms();

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCo), gl.STATIC_DRAW);

	gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0);

	this.uDraw(posAttribute, textureAttribute);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	gl.bindTexture(gl.TEXTURE_2D, null);

	//pop back to old matrix
	mvPopMatrix();
    };
    this.uDraw = function(posAttr, texAttr) { //because there's no real concept of a 'super' call in JS, specific objects can draw what they want
    };
    this.loadBBox = function(BoundingBox) {
	BoundingBox.setEntityTag(this.tag);
	BoundingBox.bufferUp();
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

    //Receive Collision objects
    this.recCollision = function(bBox1, bBox2) {
	//set pointers (/whatever the hell javascript wants to do) to current colliding boxes
	this.bBoxCol = bBox1;
	this.bBoxColW = bBox2;
    }

    /*this.updateTexture = function(frameNum) {
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);

	this.frame++
	if(this.frame > frameNum) {
	    this.frame = 1;
	}
	switch(this.frame) {
	    case 1:
		this.texCo = [
		    0.0, 0.0,
		    0.0, 1.0,
		    0.5, 0.0,
		    0.5, 1.0
	        ];
	    case 2:
		  this.texCo = [
		      0.5, 0.0,
		      0.5, 1.0,
		      1.0, 0.0,
		      1.0, 1.0
		   ];
	}

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCo), gl.STATIC_DRAW);

    }*/
}
