function Res() {
    this.buffers = {
	quad: new Array()
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
}
