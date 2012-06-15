//various variables
var textureLoader;
var quadVertsBuff;
var quadVertTexCoBuff;
var quadVertsIndexBuff;
var mvMatrix;
var shaderProgram;
var res;
var positionAttribute;
var textureAttribute;
var perspectiveMatrix;

var TESTQUAD;

var WIDTH = 400;
var HEIGHT = 600;

var fbo; //framebuffer
var rbo; //renderbuffer

var dt = new Timer();
var world;

var ultiQuad = new Quad();
ultiQuad.xPos = 0;
ultiQuad.yPos = 0;
ultiQuad.width = 400;
ultiQuad.height = 600;


var spawnX = 200,
    spawnY = 300,
    playerWidth = 100,
    playerHeight = 100;
	   
$(document).ready(function() {
    main();
});

function main() {
  var canvas = document.getElementById("canvas");

  initWebGL(canvas);

  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(gl.FALSE)

    //for errr... texture loading!
    textureLoader = new TextureUtil.TextureLoader(gl);

    res = new Res();
    
    initFBO();

    initShaders();
    
    initWorld();

    var fps = 0;

    //start timer for finding delta
    dt.start();
   
    loop();
  }
}

function loop() {
    requestAnimationFrame(loop);
    updateScene(dt.getTicks() / 1000.0);
    drawScene();
    dt.start();
}

function initWebGL(canvas) {
  gl = null;
  
  try {
    gl = canvas.getContext("experimental-webgl");
  }
  catch(e) {
  }
    
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }

  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
}

function updateScene(dt) {
    world.update(dt);
}

function initFBO() {
    fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    ultiQuad.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, ultiQuad.texture);
    
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    //gl.generateMipmap(gl.TEXTURE_2D);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, WIDTH, HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    /*rbo = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA4, WIDTH, HEIGHT);*/

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, ultiQuad.texture, 0);
    //gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, rbo);

    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
	console.log("cool");
    } else {
	console.log("not cool");
    }

    gl.bindTexture(gl.TEXTURE_2D, null);
    //gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function drawScene() {
    perspectiveMatrix = makeOrtho(0.0, 400.0, 0.0, 600.0, -1.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    loadIdentity();

    mvTranslate([-world.camera.xPos, -world.camera.yPos, 0.0]);

    world.draw(positionAttribute, textureAttribute, player);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    gl.viewport(0, 0, WIDTH, HEIGHT);

    TESTQUAD.texture = res.textures.player;
	
    TESTQUAD.draw(positionAttribute, textureAttribute);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    //Setup the canvas for viewing

    //perspectiveMatrix = makeOrtho(0.0, 400.0, 0.0, 600.0, -1.0, 1.0);

    //gl.clear(gl.COLOR_BUFFER_BIT);

    //loadIdentity();

    //mvTranslate([0.0, 0.0, 0.0]);

    //draw the texture in that fbo to the canvas' fbo (the default)
    //ultiQuad.texture = res.textures.player;

    ultiQuad.bufferUp();
    ultiQuad.draw(positionAttribute, textureAttribute);

    gl.flush();
}

function initWorld() {
    world = new World();

    player = new Player(playerWidth, playerHeight, spawnX, spawnY);
    player.bufferUp();

    TESTQUAD = new Cloud(100, 100, 0, 0, 0);
    TESTQUAD.bufferUp();

    world.pushEntity(player);

    world.genClouds(player);
}

function initShaders() {
  //var fragmentShader = getShader(gl, "shader-fs");
  var fragmentShader = getShader(gl, "blur-shader");
  var vertexShader = getShader(gl, "shader-vs");
    
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }
  
  gl.useProgram(shaderProgram);
  
  positionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(positionAttribute);
  
  textureAttribute = gl.getAttribLocation(shaderProgram, "aTexCo");
  gl.enableVertexAttribArray(textureAttribute);
}

function getShader(gl, id) {
  var shaderScript = document.getElementById(id);
  
  if (!shaderScript) {
    return null;
  }
  
  var theSource = "";
  var currentChild = shaderScript.firstChild;
  
  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }
  
  var shader;
  
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
  
  gl.shaderSource(shader, theSource);
  
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }
  
  return shader;
}

//Useful Matrix functions

var mvMatrixStack = [];

function loadIdentity() {
  mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

function mvPushMatrix(m) {
  if (m) {
    mvMatrixStack.push(m.dup());
    mvMatrix = m.dup();
  } else {
    mvMatrixStack.push(mvMatrix.dup());
  }
}

function mvPopMatrix() {
  if (!mvMatrixStack.length) {
    throw("Can't pop from an empty matrix stack.");
  }
  
  mvMatrix = mvMatrixStack.pop();
  return mvMatrix;
}

function mvRotate(angle, v) {
  var inRadians = angle * Math.PI / 180.0;
  
  var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
  multMatrix(m);
}
