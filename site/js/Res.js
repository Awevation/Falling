function makeVertBuffer(width, height) {
    var buffer = gl.createBuffer();
    var vertices = [
	0.0, height, 0.0,
	0.0, 0.0,    0.0,
	width, height, 0.0,
	width, 0.0, 0.0
    ]

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return buffer;
};


function Res() {
    this.buffers = {
	quad: makeVertBuffer(100, 100)
    };
    this.textures = {
	player:
	    textureLoader.load("images/player/player.png", function(texture) {
    		//handler
	    }),
	cloud:
	    textureLoader.load("images/cloud.png", function(texture) {
		//handler
	    }),
	sky:
	  textureLoader.load("images/sky.png", function(texture) {
      	      //handler	     
	  }),
	boundingBox:
	    textureLoader.load("images/boundingBox.png", function(texture) {
		//handler      
	    })
    };

    this.bufferUp = function() {
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

}
