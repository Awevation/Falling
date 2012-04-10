//various variables

var canvas;
var gl;
var quadVertsBuff;
var quadVertTexCoBuff;
var quadVertsIndexBuff;
var mvMatrix;
var shaderProgram;

var positionAttribute;
var textureAttribute;
var perspectiveMatrix;
var lastUpdate = 0.0;

var clouds = new Array();

$(document).ready(function() {
    main();
});

function main() {
  canvas = document.getElementById("canvas");

  initWebGL(canvas);
	
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //gl.clearDepth(1.0);                 
    gl.disable(gl.DEPTH_TEST);           
    
    initShaders();
    
    initWorld();

    /*sky.genCloud();
    sky.genCloud();*/
    sky.genCloud();
    sky.genCloud();
   
    setInterval(function() {
	updateScene();
	drawScene();
    }, 1000/60);
  }
}

function initWebGL() {
  gl = null;
  
  try {
    gl = canvas.getContext("experimental-webgl");
  }
  catch(e) {
  }
    
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }

  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
}

function initBuffers() {
    quadVertsBuff = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, quadVertsBuff);

    var quadVerts = [
	0.0, quadSize, 0.0,
	0.0, 0.0, 0.0,
	quadSize, quadSize, 0.0,
	quadSize, 0.0, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVerts), gl.STATIC_DRAW);

    quadVertTexCoBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVertTexCoBuff);

    var quadTexCo = [
	0.0, 0.0,
	0.0, 1.0,
	1.0, 0.0,
	1.0, 1.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadTexCo), gl.STATIC_DRAW);

    quadVertsIndexBuff = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadVertsIndexBuff);

    var quadVertIndices = [
	0, 1, 2, 3
    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(quadVertIndices), gl.STATIC_DRAW);
}

function updateScene() {
    var startTime = (new Date).getTime();

    if(lastUpdate) {
	var dt = startTime - lastUpdate;
	sky.update(dt);
	
	for(var i = 0.0; i < sky.clouds.length; i++) {
	    if(player.checkCollision(sky.clouds[i])) {
		break;
	    } else {
		continue;
	    }
	}

	player.update(dt);
    }
    lastUpdate = startTime;
}

function drawScene() {
  //Setup initial scene
  gl.clear(gl.COLOR_BUFFER_BIT);

  perspectiveMatrix = makeOrtho(0.0, 400.0, 0.0, 600.0, -1.0, 1.0);

  loadIdentity();
  mvTranslate([0.0, 0.0, 0.0]);

  sky.draw(posAttribute, textureAttribute);
  player.draw(posAttribute, textureAttribute);
}

function initWorld() {
    sky = new Sky(400, 600, 0, 0);
    sky.loadTexture("../images/sky.png");
    sky.bufferUp();

    player = new Player(50, 100, 200, 500);
    player.loadTexture("../images/player.png");
    player.bufferUp();
}

function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");
    
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }
  
  gl.useProgram(shaderProgram);
  
  posAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(posAttribute);
  
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
