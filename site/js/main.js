//various variables
var textureLoader;
var quadVertsBuff;
var quadVertTexCoBuff;
var quadVertsIndexBuff;
var mvMatrix;
//shader programs
var shaderProgramBlur;
var shaderProgramNormal;

var res;
var positionAttribute;
var textureAttribute;
var perspectiveMatrix;

var texture;

var WIDTH = 400;
var HEIGHT = 600;

var fbo; //framebuffer
var rbo; //renderbuffer

var dt = new Timer();
var world;

var ultiQuad = new TESTQUAD(400, 600, 0, 0, 0, null);

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
    
    initShaders();
    
    initWorld();

    var fps = 0;

    initFBO();

    ultiQuad.bufferUp();

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

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2048, 2048, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    rbo = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 2048, 2048);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, ultiQuad.texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rbo);

    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
        console.log("cool");
    } else {
        console.log("not cool");
    }

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function drawScene() {
    //set the 'normal' shader to use
    gl.useProgram(shaderProgramNormal);
         
    positionAttribute = gl.getAttribLocation(shaderProgramNormal, "aVertexPosition");
    gl.enableVertexAttribArray(positionAttribute);         
   
    textureAttribute = gl.getAttribLocation(shaderProgramNormal, "aTexCo");
    gl.enableVertexAttribArray(textureAttribute);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    perspectiveMatrix = makeOrtho(0.0, WIDTH, 0.0, HEIGHT, -1.0, 1.0);

    gl.viewport(0, 0, 2048, 2048);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    loadIdentity();

    mvTranslate([-world.camera.xPos, -world.camera.yPos, 0.0]);
    //mvTranslate([0.0, 0.0, 0.0]);
    world.draw(shaderProgramNormal, positionAttribute, textureAttribute, player);

    gl.flush();

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    //set the blur shader to use, for a second pass
    gl.useProgram(shaderProgramBlur);
         
    positionAttribute = gl.getAttribLocation(shaderProgramBlur, "aVertexPosition");
    gl.enableVertexAttribArray(positionAttribute);
               
    textureAttribute = gl.getAttribLocation(shaderProgramBlur, "aTexCo");

    gl.enableVertexAttribArray(textureAttribute);
    //Setup the canvas for viewing
    gl.viewport(0, 0, WIDTH, HEIGHT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    loadIdentity();

    mvTranslate([0.0, 0.0, 0.0]);

    //draw the scene
    ultiQuad.draw(shaderProgramBlur, positionAttribute, textureAttribute, player);

    gl.flush();
}

var test;

function initWorld() {
    world = new World();

    player = new Player(playerWidth, playerHeight, spawnX, spawnY);
    player.bufferUp();

    world.pushEntity(player);

    world.genClouds(player);

    test = new TESTQUAD(100, 100, 100, 100, res.textures.cloud);
    test.bufferUp();
}

function initShaders() {
  var fragmentShaderNorm = getShader(gl, "shader-fs");
  var vertexShaderNorm = getShader(gl, "shader-vs");
  var fragmentShaderBlur = getShader(gl, "blur-fs");
  
  shaderProgramNormal = gl.createProgram();
  gl.attachShader(shaderProgramNormal, vertexShaderNorm);
  gl.attachShader(shaderProgramNormal, fragmentShaderNorm);
  gl.linkProgram(shaderProgramNormal);
  
  if (!gl.getProgramParameter(shaderProgramNormal, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program. (Normal)");
  }

  /*gl.useProgram(shaderProgram);
  
  positionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(positionAttribute);
  
  textureAttribute = gl.getAttribLocation(shaderProgram, "aTexCo");
  gl.enableVertexAttribArray(textureAttribute);*/

  shaderProgramBlur = gl.createProgram();
  gl.attachShader(shaderProgramBlur, vertexShaderNorm);
  gl.attachShader(shaderProgramBlur, fragmentShaderBlur);
  gl.linkProgram(shaderProgramBlur);

    if (!gl.getProgramParameter(shaderProgramBlur, gl.LINK_STATUS)) {
	    alert("Unable to initialize the shader program. (Blur)");
    }
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

function setMatrixUniforms(shaderProgram) {
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
