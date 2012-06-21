function BoundingBox(xOff, yOff, width, height) {
    this.xOff = xOff;
    this.yOff = yOff;
    this.xPos = 0;
    this.yPos = 0;
    this.width = width;
    this.height = height;
    //tag that inherits the name of the entity
    this.entityTag = "";
    //tag for bBox
    this.tag = "";
    //set the bBox is member of
    this.set = "";
    this.texture = res.textures.boundingBox;

    this.setEntityTag = function(tag) {
	this.entityTag = tag;
    }
    this.setSet = function(set) {
	this.set = set;
    }

    this.setTag = function(tag) {
	this.tag = tag;
    }

    this.bufferUp = function() {
	this.verticesBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);

	this.vertices = [
	    0.0,        this.height, 0.0,
	    0.0,        0.0,         0.0,
	    this.width, this.height, 0.0,
	    this.width, 0.0,         0.0
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
    };

    this.draw = function(shaderProgram, posAttribute, textureAttribute) {
        mvPushMatrix();

        mvTranslate([this.xPos, this.yPos, 0.0]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.vertexAttribPointer(posAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(textureAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        setMatrixUniforms(shaderProgram);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCo), gl.STATIC_DRAW);

        gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);

        //pop back to old matrix
        mvPopMatrix();

    }
}
