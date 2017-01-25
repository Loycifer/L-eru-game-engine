'use strict';(function(globalScope,nameSpace){"use strict";
/*
 * Monkeypatches. Ook ook.
 */

//window.performance.now() polyfill
if (window.performance === undefined)
{
    window.performance = {};
}

if (window.performance.now === undefined)
{
    window.performance.now = function() {
	return Date.now();
    };
}

//Array extended methods
//Array.prototype.copy = function()
//{
//    return this.slice(0);
//};
//
//Array.prototype.copy2 = function()
//{
//    var length = this.length;
//    var arrayCopy = [];
//    for (var i = 0; i < length; i++)
//    {
//	if (this[i].isArray)
//	{
//	    arrayCopy[i] = this[i].copy2();
//	}
//    }
//    return arrayCopy.slice(0);
//};


/**
 * Array.mapQuick() - Array map function for arrays containing mutable objects.  When using shallow arrays containing numbers, strings, or bools, you will need to directly access the source array in your callback.  Modifies and returns original array without creating a new Array object.  Works faster than JavaScript's immutable Array.map().
 * @method
 * @param {Function} callback
 * @returns {Array}
 */
Array.prototype.mapQuick = function(callback)
{
    var length = this.length;
    for (var i = 0; i < length; i++)
    {
	callback(this[i], i);
    }
    return this;
};



Array.prototype.sortBy = function(sorter, order)
{
    var length = this.length;
    if (order === undefined)
    {
	order = 1;
    }

    for (var i = 0; i < length; i++)
    {
	if (this[i] instanceof Array)
	{
	    this[i].sortBy(sorter, order);
	}
    }

    this.sort(function(a, b) {
	var current = +a[sorter];
	var next = +b[sorter];
	return order * (current - next);
    });
};

Array.prototype.getRandomElement = function()
{
    return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.removeElement = function(element)
{
    alert(2);
    var targetIndex = this.indexOf(element);

    if (targetIndex !== -1)
    {
	alert("removed " + this[targetIndex]);
	this.splice(targetIndex, 1);
    }
    return this;
};

Array.prototype.draw = function(targetContext, camera)
{
    var length = this.length;

    for (var i = 0; i < length; i++)
    {
	if (this[i] && this[i].draw)
	{
	    this[i].draw(targetContext,camera);
	}
    }
};

Array.prototype.update = function(dt)
{


    var length = this.length;

    for (var i = 0; i < length; i++)
    {
	if (this[i] && this[i].update)
	{
	    this[i].update(dt);
	}
    }
};

Array.prototype.handleClick = function(mouseX, mouseY, e)
{
    var length = this.length;

    for (var i = length - 1; i >= 0; i--)
    {

	if (this[i].handleClick && this[i].handleClick(mouseX, mouseY, e))
	{
	    return true;
	}
    }
};

 Number.prototype.clamp = function(min, max) {
 return Math.min(Math.max(this, min), max);
 };

 Number.prototype.isBetween = function (min, max)
 {
 return (this === this.clamp(min,max));
 };



//Math extended methods

Math.jordanCurve = function(x, y, vertices)
{

    var isInPoly = false;
    //var vertices = this.getVertices();
    var length = vertices.length;
    //alert(vertices);
    for (var i = 0, j = length - 1; i < length; j = i++)
    {
	if ((vertices[i][1] > y) !== (vertices[j][1] > y))
	{
	    if (x < ((vertices[j][0] - vertices[i][0]) * (y - vertices[i][1]) / (vertices[j][1] - vertices[i][1]) + vertices[i][0]))
	    {
		isInPoly = !isInPoly;
	    }

	}
    }
    return isInPoly;
};


Math.HSLtoRGB = function(hue,saturation,lightness)
{

};

Math.log10 = function(x)
{
    return (Math.log(x) / Math.LN10);
};

Math.degToRad = function(deg)
{
    return (deg * (Math.PI / 180));
};

Math.radToDeg = function(rad)
{
    return (rad * (180 / Math.PI));
};

Math.vectorX = function(speed, direction)
{
    switch (direction)
    {
	case 0:
	    return speed;
	    break;
	case 180:
	    return -speed;
	    break;
	case 90:
	case -90:
	    return 0;
	    break;
	default:
	    return Math.cos(Math.degToRad(direction)) * speed;
	    break;
    }
};

Math.vectorY = function(speed, direction)
{
    switch (direction)
    {
	case 0:
	case 180:
	    return 0;
	    break;
	case 90:
	    return -speed;
	    break;
	case -90:
	    return speed;
	    break;
	default:
	    return Math.sin(Math.degToRad(direction)) * speed;
	    break;
    }
};

Math.Vector = function(magnitude, direction)
{
    this.magnitude = magnitude;
    this.direction = direction;
};

Math.Vector.prototype.addVector = function(vector)
{
    var d1 = Math.degToRad(this.direction);
    var d2 = Math.degToRad(vector.direction);

    var x1 = Math.cos(d1) * this.magnitude;
    var x2 = Math.cos(d2) * vector.magnitude;

    var y1 = -Math.sin(d1) * this.magnitude;
    var y2 = -Math.sin(d2) * vector.magnitude;

    var adj = x1 + x2;
    var opp = y1 + y2;

    var newDirection = Math.atan(opp / adj);
    var newMagnitude = Math.sqrt((Math.pow(adj, 2) + Math.pow(opp, 2)));

    this.magnitude = newMagnitude;
    this.direction = newDirection;
};

Math.rotatePoint = function(x,y,angle)
{

    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    var x1 = (cos * x) + (sin * y );
    var y1 = -(sin * x)+ (cos * y);
    return {x:x1,y:y1};
};;
/*
 * Ludix.js Game Engine Core
 */

var L = {};

/*
 * Core Structuring
 */


L.system = {};  // Namespace with system variables and functions
L.objects = {};  // Namespace with all game objects
L.game = {};  // Namespace holding game data
L.pipe = {};  // Namespace for holding 'global' objects

L.log = console.log;
L.alert = alert;

L.start = function() {

    //window.removeEventListener('load', L.start);
    var game = L.game;
    var system = L.system;

    game.settings();
    system.setup();
    game.resources();
    system.setLoadScreen();

    var gameLoop = function() {
	requestAnimationFrame(gameLoop);
	var system = L.system;

	if (system.nextScene !== undefined)
	{
	    system.currentScene = system.nextScene;
	    system.nextScene = undefined;
	}
	var thisScene = system.currentScene;
	//var game = L.game;

	var now = system.now = window.performance.now();
	var dt = system.dt = system.timeScale * (system.now - system.then) / 1000;
	if (dt > 1 / system.frameCap)
	{
	    dt = system.dt = 1 / system.frameCap;
	}
	system.then = now;
	thisScene.update(dt * ((system.isPaused) ? 0 : 1));
	thisScene.draw();
    };
    gameLoop();

};

L.log = function(message)
{
    if (console && console.log)
    {
	console.log(message);
    }
};

L.alert = function(message)
{
    if (window && window.alert)
    {
	window.alert(message);
    }
};

L.system = {};
L.system.orientation = 'landscape';
L.system.fullscreen = true;
L.system.canvasRatio = 1;
L.system.timeScale = 1;
L.system.frameCap = 30;
L.system.now, L.system.then = window.performance.now();
L.system.dt = 0;
L.system.isPaused = false;
L.system.autoPause = true;



L.system.resourcePath = "resources/";		    // Holds path to resource folder
L.system.soundPath = "sounds/";			    // Holds path to sound folder in resources folder
L.system.texturePath = "textures/";		    // Holds path to image folder in resources folder
L.system.expectedResources = 0;
L.system.loadedResources = 0;

L.system.pause = function()
{
    L.system.isPaused = true;
};

L.system.resume = function()
{
    L.system.isPaused = false;
};

L.system.togglePause = function()
{
    L.system.isPaused = !L.system.isPaused;
};

L.system.width = 640;
L.system.height = 480;
L.system.canvasLocation = document.body;
Object.defineProperty(L.system, "centerX", {
    get: function()
    {
	return L.system.width / 2;
    }
});
Object.defineProperty(L.system, "centerY", {
    get: function()
    {
	return L.system.height / 2;
    }
});






L.system.layerAlpha = 1;
L.system.currentScene = {};
L.system.nextScene;
L.system.previousScene = {};
L.scenes = {};
/**********************************************************************
 *  Resources
 *
 */

L.texture = {};
L.textures = L.texture;

L.load = {};

L.load.texture = function(file, textureName)
{
    L.system.expectedResources += 1;
    var thisTexture = new Image();
    var name = (textureName === undefined) ? file.substr(0, file.lastIndexOf(".")) : textureName;

    thisTexture.onload = function() {
	L.system.loadedResources += 1;
	console.log("Succesfully loaded texture " + file + ".");
	thisTexture.onload = undefined;
	thisTexture.onerror = undefined;
    };

    thisTexture.onerror = function() {
	L.alert("Something went wrong loading texture file " + file + ".");
    };

    thisTexture.src = L.system.resourcePath + L.system.texturePath + file;

    L.texture[name] = thisTexture;
    if (thisTexture.complete)
    {
	thisTexture.onload();
    }
    return thisTexture;
};

L.load.base64texture = function(file, textureName)
{
    L.system.expectedResources += 1;
    var thisTexture = new Image();
    if (textureName === undefined)
    {
	console.log("Error: cannot load base 64 texture without textureName argument. Please supply a name.");
	return;
    }
    var name = textureName;

    thisTexture.onload = function() {
	L.system.loadedResources += 1;
	console.log("Succesfully loaded base64 texture " + textureName + ".");
	thisTexture.onload = undefined;
	thisTexture.error = undefined;
    };

    thisTexture.onerror = function() {
	L.alert("Something went wrong loading base64 texture " + textureName + ".");
    };

    thisTexture.src = file;

    L.texture[name] = thisTexture;
    if (thisTexture.complete && thisTexture.naturalWidth > 0)
    {
	thisTexture.onload();
    }
    return thisTexture;
};
L.load.base64Texture = L.load.base64texture;

L.load.INIFile = function(file, nameSpace)
{
    if (L.INI === undefined)
    {
	L.INI = {};
    }
    L.system.expectedResources += 1;
    var request = new XMLHttpRequest();
    var url = L.system.resourcePath + file;
    request.open('GET', url, true);

    request.onload = function() {
	var textLines = request.responseText.split("\n");
	var targetNS = L.INI[nameSpace] = {};
	var textLength = textLines.length;
	var section = "";

	for (var i = 0; i < textLength; i++)
	{
	    var currentLine = textLines[i].trim();
	    if (currentLine === "")
	    {
		continue;
	    }
	    var firstChar = currentLine.substring(0, 1);
	    switch (firstChar)
	    {
		case ";":
		case "#":
		    continue;
		    break;
		case "[":
		    var closingBracket = currentLine.indexOf("]");
		    if (closingBracket === -1)
		    {
			alert("Section syntax error in INI file " + file + " at line " + i + ".");
		    }
		    section = currentLine.substring(1, closingBracket);
		    targetNS[section] = {};
		    continue;
		    break;
		default:
		    var statements = currentLine.split("=");
		    var varName = statements[0].trim();
		    var assignment = statements[1].trim();
		    if (!isNaN(assignment))
		    {
			assignment = +assignment;
		    }
		    if (section !== "")
		    {
			targetNS[section][varName] = assignment;
		    } else
		    {
			targetNS[varName] = assignment;
		    }
		    break;
	    }
	}
	L.system.loadedResources += 1;

    };

    request.onerror = function()
    {
	alert("error " + request.readystate + " " + request.status);
    };

    request.send();

};

L.sound = {};


window.addEventListener('load', L.start);



L.system.renderCanvas = [];
L.system.renderContext = [];
L.system.bufferCanvas = [];
L.system.bufferContext = [];
L.system.fxCanvas = [];
L.system.fxContext = [];
L.system.pixelCanvas = [];
L.system.pixelContext = [];;

L.objects.Camera = function()
{
    //2D Settings
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.zoom = 1;


    //3D settings
    this.z = 0;
    this.yaw = 0;
    this.pitch = 0;
    this.focalLength = 1000;
};

L.objects.Camera.update = function(dt)
{

};

L.objects.Camera.followObject = function(targetObject)
{
    this.x = targetObject.x;
    this.y = targetObject.y;
};


L.objects.Camera.prototype.setXY = function(x,y)
{
  this.x = x;
  this.y = y;
};
L.objects.Camera.prototype.setXYZ = function(x,y,z)
{
    this.x = x;
    this.y = y;
    this.z = z;
};

L.objects.Camera.prototype.setViewAngle = function(angle)
{
    this.focalLength = L.system.width/angle;
};

L.objects.Camera.prototype.getViewAngle = function()
{
  return L.system.width/this.focalLength;
};;




L.system.setResolution = function(xRes, yRes)
{
    if (isNaN(xRes) || isNaN(yRes))
    {
	alert("L.system.setResolution() parameters must be numeric.");
    }
    L.system.width = xRes;
    L.system.height = yRes;
};

L.system.setFullscreen = function(fullscreen)
{
    if (fullscreen !== false && fullscreen !== true)
    {
	alert("L.system.setFullscreen() parameter must be boolean.");
    }
    L.system.fullscreen = fullscreen;
};

L.system.setOrientation = function(orientation)
{
    var lowOrientation = orientation.toLowerCase();
    if (["auto", "landscape", "portrait"].indexOf(lowOrientation) === -1)
    {
	alert("L.system.setOrientation() parameter must be \"auto\", \"landscape\", or \"portrait\".");
    }
    L.system.orientation = lowOrientation;
};

L.system.setAutoPause = function(autoPause)
{
    if (autoPause !== false && autoPause !== true)
    {
	alert("L.system.setAutoPause() parameter must be boolean.");
    }
    L.system.autoPause = autoPause;
};

L.system.setCanvasLocation = function(DOMElement)
{
    if (!(DOMElement instanceof HTMLElement))
    {
	alert("L.system.setCanvasLocation() parameter must be a DOM element.");
    }
    L.system.canvasLocation = DOMElement;
};


L.system.setup = function()
{
    var width = L.system.width;
    var height = L.system.height;
    var aspectRatio = L.system.aspectRatio = width / height;
    if (L.system.orientation !== "auto")
    {
	try {
	    screen.lockOrientation(L.system.orientation);
	}
	catch (e)
	{
	    L.log("Warning: Screen orientation could not be locked.");
	}
    }



    L.system.renderCanvas[0] = document.createElement("canvas");
    L.system.renderCanvas[0].width = width;
    L.system.renderCanvas[0].height = height;
    L.system.canvasLocation.appendChild(L.system.renderCanvas[0]);
    L.system.renderContext[0] = L.system.renderCanvas[0].getContext("2d");
//    L.system.renderContext[0].imageSmoothingEnabled = false;
//    L.system.renderContext[0].webkitImageSmoothingEnabled = false;
//    L.system.renderContext[0].mozImageSmoothingEnabled = false;




    L.system.bufferCanvas[0] = document.createElement('canvas');
    L.system.bufferCanvas[0].width = width;
    L.system.bufferCanvas[0].height = height;
    L.system.bufferContext[0] = L.system.bufferCanvas[0].getContext("2d");
//    L.system.bufferContext[0].imageSmoothingEnabled = false;
//    L.system.bufferContext[0].webkitImageSmoothingEnabled = false;
//    L.system.bufferContext[0].mozImageSmoothingEnabled = false;


    L.system.fxCanvas[0] = document.createElement('canvas');
    L.system.fxCanvas[0].width = width;
    L.system.fxCanvas[0].height = height;
    L.system.fxContext[0] = L.system.fxCanvas[0].getContext("2d");

    L.system.pixelCanvas[0] = document.createElement('canvas');
    L.system.pixelCanvas[0].width = 1;
    L.system.pixelCanvas[0].height = 1;
    L.system.pixelContext[0] = L.system.pixelCanvas[0].getContext("2d");




    //L.system.canvasX = L.system.renderCanvas[0].offsetLeft;
    //L.system.canvasY = L.system.renderCanvas[0].offsetTop;
    Object.defineProperty(L.system, "canvasX", {
	get: function() {
	    return L.system.renderCanvas[0].offsetLeft;
	}
    });
    Object.defineProperty(L.system, "canvasY", {
	get: function() {
	    return L.system.renderCanvas[0].offsetTop;
	}
    });

    L.mouse.setupEventListeners();



    window.addEventListener("keydown", doKeyDown, false);
    function doKeyDown(event) {
	if (L.system.currentScene.doKeyDown !== undefined)
	{
	    L.system.currentScene.doKeyDown(event);
	}
	return false;
    }

    window.addEventListener("keyup", doKeyUp, false);
    function doKeyUp(event) {
	if (L.system.currentScene.doKeyUp !== undefined)
	{
	    L.system.currentScene.doKeyUp(event);
	}
	return false;
    }

    if (L.system.fullscreen) {
	//var CSSOptions = "margin: 0px; padding: 0px; border-width: 0px;	overflow:hidden;";
	//document.body.style = CSSOptions;
	//document.getElementsByTagName("html")[0].style = CSSOptions;
	//L.system.renderCanvas[0].style = "margin:0px auto; transition-property: all; transition-duration: 1s; transition-timing-function: ease;" + CSSOptions;
	L.display.autoResize();
	window.addEventListener('resize', L.display.autoResize, true);
    }

    if (L.system.autoPause)
    {
	window.addEventListener('blur', function() {
	    L.system.isPaused = true;
	    L.system.then = window.performance.now();
	});
	window.addEventListener('focus', function() {
	    L.system.isPaused = false;
	    L.system.then = window.performance.now();
	});
    }

};

L.system.setLoadScreen = function()
{
    L.load.base64texture("data:image/png;base64,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", "base64test"
    );
    var system = L.system;
    var width = system.width;
    var height = system.height;
    var objects = L.objects;


    var loadScreen = new objects.Scene();
    loadScreen.motionBlur = 0.8;
    loadScreen.bgFill = "#000000";

    var iMake = new objects.Textbox("https://github.com/Loycifer/Ludix.js", width / 2, 5 * height / 6);
    iMake.alignment = "center";
    iMake.textFill = "black";
    iMake.backgroundFill = "";
    iMake.fontSize = (width / 30);
    iMake.visible = true;
    iMake.autoSize();
    iMake.onClick = function(x, y)
    {
	if (Math.sqrt((Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2))) < textLogo.clipRadius)
	{
	    window.open('https://github.com/Loycifer/Ludix.js');
	}
    };
    iMake.update = function(dt)
    {
	var mouse = L.mouse;
	if (Math.jordanCurve(mouse.x, mouse.y, this.getVertices()))
	{
	    iMake.textFill = "blue";

	}
	else
	{
	    iMake.textFill = "black";
	}
    };
    var iMakeClicker = {
	handleClick: function(x, y, e)
	{
	    iMake.handleClick(x, y, e);
	}
    };

/*
    var loadingText = new objects.Textbox("0%", width / 2, height / 2 + (width / 30));

    loadingText.textFill = "white";
    loadingText.backgroundFill = "";
    loadingText.fontSize = (width / 30);
    //loadingText.y -= loadingText.fontSize / 2;
    loadingText.alignment = "center";
    loadingText.visible = true;
    loadingText.autoSize();
    loadingText.alpha = 1;
    */

    var loadingWhite = new objects.Textbox("loading",width/2,height/2);
    loadingWhite.alignment = "center";
    loadingWhite.textFill = "white";
    loadingWhite.backgroundFill = "";
    loadingWhite.fontSize = (width / 30);
    loadingWhite.y -= loadingWhite.fontSize / 1.5;
    loadingWhite.visible = true;
    loadingWhite.autoSize();

    var textLogo = new objects.Sprite("base64test");
    textLogo.width = 402;
    textLogo.height = 152;
    textLogo.handle = {
	x: 201,
	y: 76
    };
    textLogo.x = width / 2;
    textLogo.y = height / 2;
    textLogo.setScale(0.6 * (width / 2) / textLogo.width);
    textLogo.clipRadius = 0;
    textLogo.draw = function(layer)
    {
	if (this.clipRadius > 0)
	{
	    layer.save();
	    layer.beginPath();
	    layer.arc(this.x, this.y, this.clipRadius, 0, Math.PI * 2, false);
	    layer.clip();

	    this.autoDraw(layer);
	    iMake.draw(layer);

	    layer.restore();
	}
    };

    var fadeRect = {
	alpha: 0
    };
    fadeRect.draw = function(layer)
    {
	layer.globalAlpha = this.alpha;
	layer.fillStyle = "black";
	layer.fillRect(-1, -1, width + 2, height + 2);
    };


    var progressOrb = {
	x: width / 2,
	y: height / 2,
	radius: width / 8,
	maxRadius: Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2,
	orbRatio: 0,
	orbAlpha: 1,
	orbColor: "white",
	lineAlpha: 1,
	lineColor: "white",
	lineWidth: 4,
	growthRatioPerSecond: 0.33,
	divisions: 0,
	divisionColor: "white",
	rainbowWidth: width / 16,
	rainbowColors: ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "white"],
	rainbowTimer: 0,
	loadTimer: 0,
	fadeTimer: 0

    };

    progressOrb.updateLoading = function(dt)
    {
	var potentialRatio = system.loadedResources / system.expectedResources;
	var currentRatio = this.orbRatio;
	this.loadTimer += dt;
	/* (this.loadTimer >= 1 && loadingText.alpha < 1)
	{
	    loadingText.alpha += 5 * dt;
	}
	if (loadingText.alpha > 1)
	{
	    loadingText.alpha = 1;
	}*/
	if (currentRatio < potentialRatio)
	{
	    this.orbRatio += this.growthRatioPerSecond * dt;
	}
	if (this.orbRatio > potentialRatio)
	{
	    this.orbRatio = potentialRatio;
	}

	if (this.orbRatio >= 1)
	{
	    this.orbRatio = 1;
	    this.update = this.updateAnimating;
	    this.draw = this.drawAnimating;
	   // loadingText.text = "100%";
	}
	/*else
	{
	    var text = Math.floor(this.orbRatio * 100) + "%";

	    loadingText.text = text;
	}
	*/


    };

    progressOrb.updateAnimating = function(dt)
    {
	iMake.update(dt);
	/*if (loadingText.alpha > 0)
	{
	    loadingText.alpha -= dt * 10;
	}
	if (loadingText.alpha < 0)
	{
	    loadingText.alpha = 0;
	}*/
	this.rainbowTimer += dt;
	lineObject.alpha -= dt / 4.5;
	vignette.alpha -= dt / 32;
	textLogo.setScale(textLogo.scale.x + (dt * 0.025));
	if (this.rainbowTimer >= 7)
	{
	    this.update = this.updateFadeOut;
	}
    };

    progressOrb.updateFadeOut = function(dt)
    {
	iMake.update(dt);
	textLogo.setScale(textLogo.scale.x + (dt * 0.025));
	fadeRect.alpha += (dt / 2);
	if (fadeRect.alpha > 1)
	{
	    fadeRect.alpha = 1;
	}
	if (fadeRect.alpha === 1)
	{
	    this.fadeTimer += dt;

	}
	if (this.fadeTimer > 1)
	{
	    L.game.main();
	}

    };

    var loadKeys = new L.keyboard.Keymap();
    loadKeys.bindKey("esc", "keyup", function() {
	if (system.loadedResources / system.expectedResources >= 1)
	{
	    L.game.main();
	}
    });
    loadScreen.keymap = loadKeys;

    progressOrb.update = progressOrb.updateLoading;

    progressOrb.drawOrb = function(layer, ratio)
    {
	loadingWhite.draw(layer);
	//loadingText.draw(layer);
	layer.globalAlpha = this.orbAlpha;
	layer.beginPath();
	layer.arc(this.x, this.y, this.radius * ratio, 0, 2 * Math.PI);
	layer.fillStyle = this.orbColor;
	layer.fill();
	layer.save();
	    layer.beginPath();
	    layer.arc(this.x, this.y, this.radius * ratio, 0, Math.PI * 2, false);
	    layer.clip();
	loadingWhite.textFill = "black";
	loadingWhite.draw(layer);
	loadingWhite.textFill = "white";
	layer.restore();
    };

    progressOrb.drawCircle = function(layer)
    {
	layer.globalAlpha = this.orbAlpha;
	layer.beginPath();
	layer.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	layer.strokeStyle = this.lineColor;
	layer.lineWidth = this.lineWidth;

	layer.stroke();
    };



    progressOrb.drawDivisions = function(layer)
    {
	if (this.divisions > 0)
	{
	    var denominator = this.divisions + 1;
	    layer.globalAlpha = this.lineAlpha;
	    layer.strokeStyle = "white";
	    layer.lineWidth = this.lineWidth / 2;

	    for (var i = 0; i < this.divisions; i++)
	    {
		layer.beginPath();
		layer.arc(this.x, this.y, this.radius * ((i + 1) / denominator), 0, 2 * Math.PI);
		layer.stroke();
	    }


	}
    };

    progressOrb.drawRainbow = function(layer)
    {
	var potentialRadius = Math.pow(this.rainbowTimer, 2) * 100;
	var width = this.rainbowWidth;
	var maxRadius = this.maxRadius;
	layer.globalAlpha = 1;
	layer.strokeStyle = this.lineColor;
	layer.lineWidth = this.lineWidth;
	for (var i = 0; i < 8; i++)
	{
	    var currentRadius = potentialRadius - (i * width);
	    if (currentRadius < 0)

	    {
		break;
	    }

	    if (i === 7 || (currentRadius - width) < maxRadius)
	    {
		layer.beginPath();
		var radius = (currentRadius < maxRadius) ? currentRadius : maxRadius;
		if (i === 7)
		{
		    textLogo.clipRadius = radius;
		}
		layer.arc(this.x, this.y, radius, 0, 2 * Math.PI);
		layer.fillStyle = this.rainbowColors[i];
		layer.fill();

		layer.stroke();
	    }
	}

    };

    progressOrb.drawLoading = function(layer)
    {
	this.drawDivisions(layer);
	this.drawOrb(layer, this.orbRatio);
	this.drawCircle(layer);
	//loadingText.draw(layer);

    };

    progressOrb.drawAnimating = function(layer)
    {
	this.drawOrb(layer, this.orbRatio);
	this.drawCircle(layer);
	//loadingText.draw(layer);
	this.drawRainbow(layer);


    };


    progressOrb.draw = progressOrb.drawLoading;


    var vignette = {
	alpha: 1,
	x: width / 2,
	y: height / 2

    };
    vignette.draw = function(layer)
    {
	if (this.alpha > 0)
	{
	    layer.globalAlpha = this.alpha;
	    var gradient = layer.createRadialGradient(this.x, this.y, 0, this.x, this.y, width / 1.9);
	    gradient.addColorStop(0, "rgba(0,0,0,0)");
	    gradient.addColorStop(1, "black");
	    layer.fillStyle = gradient;
	    layer.fillRect(0, 0, width, height);
	}
    };

    var lineObject = {
	alpha: 1,
	colorLineWidth: width / (150 * 3),
	scanLineWidth: (height + 1) / (200),
	colors: ["#ff0000", "#00ff00", "#0000ff"]
    };
    lineObject.draw = function(layer)
    {
	if (this.alpha > 0)
	{
	    for (var colorNumber = 0; colorNumber < 3; colorNumber++)
	    {
		var colorLineWidth = this.colorLineWidth;
		layer.globalAlpha = this.alpha / 3;
		layer.lineWidth = colorLineWidth;
		layer.strokeStyle = this.colors[colorNumber];
		layer.beginPath();
		for (var i = (colorNumber * colorLineWidth) + (colorLineWidth / 2), h = height, w = width; i < w; i += 3 * colorLineWidth)
		{
		    layer.moveTo(i, 0);
		    layer.lineTo(i, h);
		}
		layer.stroke();
	    }
	    layer.globalAlpha = this.alpha * 0.9;
	    layer.lineWidth = 1;//this.scanLineWidth/3;
	    layer.strokeStyle = "#000000";
	    layer.beginPath();
	    for (var i = 0.5, h = height, w = width; i <= h + 1; i += 2)
	    {
		layer.moveTo(0, i);
		layer.lineTo(w, i);
	    }
	    layer.stroke();
	}
    };

    loadScreen.layers["background"].addObject(progressOrb);
    loadScreen.layers["background"].addObject(iMakeClicker);

    loadScreen.layers["background"].addObject(textLogo);
    loadScreen.layers["background"].addObject(lineObject);
    loadScreen.layers["background"].addObject(vignette);
    loadScreen.layers["background"].addObject(fadeRect);

    loadScreen.setScene();
};
;

L.mouse = {};
L.mouse.x = 0;
L.mouse.y = 0;
L.mouse.buttons = [];
L.mouse.buttons[0] = {
    name: 'left',
    isDown: false,
    lastDown: {
	x: 0,
	y: 0
    }
};
L.mouse.buttons[1] = {
    name: 'middle',
    isDown: false,
    lastDown: {
	x: 0,
	y: 0
    }
};
L.mouse.buttons[2] = {
    name: 'right',
    isDown: false,
    lastDown: {
	x: 0,
	y: 0
    }
};
L.mouse.touchEnabled = false;
L.mouse.reset = function()
{
  for (var i = 0; i < 3; i++)
  {
      var currentButton = this.buttons[i];
      currentButton.isDown = false;
      currentButton.lastDown.x = 0;
      currentButton.lastDown.y = 0;
  }
};

L.system.handleClick = function(e)
{
var mouseX = 0;
var mouseY = 0;
var type = e.type;
    if (e.targetTouches) {

	mouseX = (e.targetTouches[0].pageX - L.system.canvasX) / L.system.canvasRatio;
	mouseY = (e.targetTouches[0].pageY - L.system.canvasY) / L.system.canvasRatio;
	var targetButton = L.mouse.buttons[0];
	if (type === 'touchstart')
	{
	    targetButton.isDown = true;
	    targetButton.lastDown.x = mouseX;
	    targetButton.lastDown.y = mouseY;
	}
	if (type === 'touchend')
	{
	    targetButton.isDown = false;
	}
    } else
    {

	var targetButton = L.mouse.buttons[e.button];
	mouseX = (e.pageX - L.system.canvasX) / L.system.canvasRatio;
	mouseY = (e.pageY - L.system.canvasY) / L.system.canvasRatio;
	if (type === 'mousedown')
	{
	    targetButton.isDown = true;
	    targetButton.lastDown.x = mouseX;
	    targetButton.lastDown.y = mouseY;
	}
	if (type === 'mouseup')
	{
	    targetButton.isDown = false;
	}

    }

    if (L.system.currentScene.handleClick && targetButton.name === 'left')
    {
	L.system.currentScene.handleClick(mouseX, mouseY, e);
    }

    e.preventDefault();
};

L.system.setMouseCoords = function(e)
{
    if (e.type !== 'touchmove')
    {
	L.mouse.x = (e.pageX - L.system.canvasX) / L.system.canvasRatio;
	L.mouse.y = (e.pageY - L.system.canvasY) / L.system.canvasRatio;
    } else {
	L.mouse.x = (e.targetTouches[0].pageX - L.system.canvasX) / L.system.canvasRatio;
	L.mouse.y = (e.targetTouches[0].pageY - L.system.canvasY) / L.system.canvasRatio;
    }

};

L.mouse.setupEventListeners = function()
{
    if ('ontouchstart' in document.documentElement)
    {
	L.mouse.touchEnabled = true;
	L.system.renderCanvas[0].addEventListener
	(
	'touchstart',
	L.system.handleClick
	);

	L.system.renderCanvas[0].addEventListener
	(
	'touchmove',
	L.system.setMouseCoords
	);

	L.system.renderCanvas[0].addEventListener
	(
	'touchend',
	L.system.handleClick
	);

    } else {
	L.system.renderCanvas[0].addEventListener
	(
	'mousedown',
	L.system.handleClick
	);

	L.system.renderCanvas[0].addEventListener
	(
	'mousemove',
	L.system.setMouseCoords
	);

	L.system.renderCanvas[0].addEventListener
	(
	'mouseup',
	L.system.handleClick
	);
    }
};
;

L.display = {
    get width() {
	return L.system.renderCanvas[0].style.offsetWidth;
    },
    set width(x) {
	L.system.renderCanvas[0].style.width = x;
    },
    get height() {
	return L.system.renderCanvas[0].style.height;
    },
    set height(x) {
	L.system.renderCanvas[0].style.height = x;
    }
};

L.display.autoResize = function()
{
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var canvasWidth = L.system.width;
    var canvasHeight = L.system.height;
    var windowAspect = windowWidth / windowHeight;

    if (windowAspect >= L.system.aspectRatio)
    {
	L.system.canvasRatio = windowHeight / canvasHeight;
	//L.system.renderCanvas[0].style.width = (windowWidth * (windowHeight * L.system.aspectRatio)) + "px";
	//L.system.renderCanvas[0].style.height = (windowHeight) + "px";
	//document.body.style.height = L.system.renderCanvas[0].style.height;
    }
    else if (windowAspect < L.system.aspectRatio)
    {
	L.system.canvasRatio = windowWidth / canvasWidth;
	//L.system.renderCanvas[0].style.width = (windowWidth) + "px";
	//L.system.renderCanvas[0].style.height = (windowHeight / L.system.aspectRatio) + "px";
	//document.body.style.width = L.system.renderCanvas[0].style.width;
    }
    L.system.renderCanvas[0].style.width = canvasWidth * L.system.canvasRatio + "px";
    L.system.renderCanvas[0].style.height = canvasHeight * L.system.canvasRatio + "px";
    document.body.style.width = "100%";//L.system.renderCanvas[0].style.width;
    //document.body.style.height = canvasHeight * L.system.canvasRatio - 0 + "px";
    document.body.style.height = Math.floor(windowHeight) + "px";
     document.body.style.marginTop = (Math.floor(windowHeight) - canvasHeight * L.system.canvasRatio)/2 + "px";
};
;


L.system.checkAudio = function() // Checks for client-supported audio type
{
    var dummyAudio = document.createElement('audio');

    if (dummyAudio.canPlayType('audio/ogg'))
    {
	L.system.audioType = ".ogg";
	L.log("Using .ogg files");
    }
    else if (dummyAudio.canPlayType('audio/mp4'))
    {
	L.system.audioType = ".m4a";
	L.log("Using .m4a files");
    }
    else if (dummyAudio.canPlayType('audio/wav'))
    {
	L.system.audioType = ".wav";
	L.log("Using .wav files");
    }
    else
    {
	L.alert("Your browser doesn't support .wav, .ogg, or .m4a audio files.");
    }
};

L.system.checkAudio();
L.audio = {};
L.audio.context = {};

try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    L.audio.context = new AudioContext();
    L.audio.compressor = L.audio.context.createDynamicsCompressor();
    L.audio.compressor.connect(L.audio.context.destination);
    L.audio.masterGain = L.audio.context.createGain();
    L.audio.masterGain.connect(L.audio.compressor);
    L.audio.masterGain.gain.value = 1;
    L.audio.soundFX = L.audio.context.createGain();
    L.audio.soundFX.connect(L.audio.masterGain);

//mix.connect(compressor);


    setupWebAudio();

}
catch (e) {
    alert('Web Audio API is not supported in this browser');
}

function setupWebAudio() {
    L.load.audio = function(file, audioName)
    {

	L.system.expectedResources += 1;
	var request = new XMLHttpRequest();
	//var name = (audioName === undefined) ? file.substr(0, file.lastIndexOf(".")) : audioName;
	var name = (audioName === undefined) ? file : audioName;
	request.open('GET', (L.system.resourcePath + L.system.soundPath + file + L.system.audioType), true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function() {

	    L.audio.context.decodeAudioData(request.response, function(audioBuffer) {

		L.sound[name] = audioBuffer;
		L.system.loadedResources += 1;
		L.log("Loaded audio file " + file);


	    }, (function() {
		L.alert("There was a problem loading " + file + ".");
	    }));
	};
	request.send();

    };

    L.objects.SoundEffect = function(audioBuffer)
    {
	if (audioBuffer === undefined)
	{
	    alert("Error accessing soundbuffer " + audioBuffer);
	}
	this.buffer = audioBuffer;
	// tell the source which sound to play

    };

    L.objects.soundFX = L.objects.SoundEffect;

    L.objects.SoundEffect.prototype.play = function(gain, panX, panY, panZ)
    {
	var source = L.audio.context.createBufferSource();
	source.buffer = L.sound[this.buffer];

	var pannerNode = L.audio.context.createPanner();
	var gainNode = L.audio.context.createGain();
	gainNode.gain.value = gain;
	pannerNode.connect(L.audio.soundFX);
	pannerNode.panningModel = "equalpower";
	pannerNode.setPosition(0, 0, 0);
	gainNode.connect(pannerNode);

	source.connect(gainNode);
	source.start(0);
	L.log("playing sound");
	return {
	    source: source,
	    gain: gainNode,
	    pan: pannerNode
	};
    };

    L.objects.Music = function(audioBuffer)
    {
	if (audioBuffer === undefined)
	{
	    alert("Error accessing soundbuffer " + audioBuffer);
	}
	this.buffer = audioBuffer;

	// tell the source which sound to play

    };

    L.objects.Music.prototype.play = function(gain, panX, panY, panZ)
    {
	var source = L.audio.context.createBufferSource();
	source.buffer = L.sound[this.buffer];
	source.loop = true;

	var pannerNode = L.audio.context.createPanner();
	var gainNode = L.audio.context.createGain();
	gainNode.gain.value = gain;
	pannerNode.connect(L.audio.soundFX);
	pannerNode.panningModel = "equalpower";
	pannerNode.setPosition(0, 0, 0);
	gainNode.connect(pannerNode);

	source.connect(gainNode);
	source.start(0);
	L.log("playing sound");
	return {
	    source: source,
	    gain: gainNode,
	    pan: pannerNode
	};

    };
};
/* global L */

/**
 * Creates a new Sprite
 * @constructor
 * @param {image} textureName
 * @param {object.<string, number|string|array|object>} [options]
 * @returns {L.objects.Sprite}
 */
L.objects.Sprite = function(textureName, options)
{

    /*
     * Animations properties are placeholders for future implementation of
     * frame-based animation
     */
    this.animations =
    {
	idle: []
    };
    this.animations.idle[0] =
    {
	img: L.texture[textureName],
	length: 1000
    };
    if (this.animations.idle[0].img)
    {
	L.log("Created Sprite from texture \'" + textureName + "\'.");
    }



    this.texture = L.texture[textureName];

    if (this.texture && this.texture.width > 0)
    {
	this.width = this.texture.width;
	this.height = this.texture.height;
	L.log("Setting Sprite dimensions to " + this.width + " by " + this.height + ".");
    }
    this.handle = {
	x: 0,
	y: 0
    };
    this.offset = {
	x: 0,
	y: 0
    };
    this.scale = {
	x: 1,
	y: 1
    };
    for (var propertyName in options)
    {
	if (options.hasOwnProperty(propertyName)) {
	    L.log("Adding property " + propertyName + " to Sprite object with with value " + JSON.stringify(options[propertyName]) + ".");
	    this[propertyName] = options[propertyName];
	}
    }

    Object.defineProperty(this, "center", {
	get: function() {
	    return {
		x: this.width / 2,
		y: this.height / 2
	    };
	}.bind(this)
    });





    this.nudeTop = 0;
    this.nudeLeft = 0;
    this.nudeRight = this.nudeLeft + this.width;
    this.nudeBottom = this.nudeTop + this.height;
    this.nudeTopLeft = [this.nudeLeft, this.nudeTop];
    this.nudeTopRight = [this.nudeRight, this.nudeTop];
    this.nudeBottomLeft = [this.nudeLeft, this.nudeBottom];
    this.nudeBottomRight = [this.nudeRight, this.nudeBottom];
    this.nudeVertices = [this.nudeTopLeft, this.nudeTopRight, this.nudeBottomRight, this.nudeBottomLeft];
    this.vertices = new Array(this.nudeVertices.length);

    this.rotationAccel = 0;

    this.accelDirection = 0;
    this.nextX = this.x;
    this.nextY = this.y;
    this.nextSpeedX = this.speedX;
    this.nextSpeedY = this.speedY;
    this.wrapX = true;
    this.wrapY = false;
    this.boundingType = "rect";


    this.blendMode = "";
    this.onClick = function() {

    };
    this.currentAnimation = "idle";
    this.currentFrame = 0;
    this.animationTimer;
    this.updateCommands = {};
    this.drawCommands = {};

//Predictive physics experimentation
    this.gravity = 0;
    this.g = 1000;
    this.direction = -Math.PI / 2;
    this.v = 0;
    this.y0 = 500 - this.y;
    this.energy = this.y0;
    this.time = 0;
    this.bounces = 0;
    this.landingTime = (this.v * Math.sin(this.direction) + Math.sqrt(Math.pow((this.v * Math.sin(this.direction)), 2) + (2 * this.g * this.y0))) / this.g;

    return this;


};

//Sprite Instance Properties

L.objects.Sprite.prototype.x = 0;
L.objects.Sprite.prototype.y = 0;
L.objects.Sprite.prototype.z = 0;
L.objects.Sprite.prototype.width = 0;
L.objects.Sprite.prototype.height = 0;

//L.objects.Sprite.prototype.scale = 1;
L.objects.Sprite.prototype.angle = 0;
L.objects.Sprite.prototype.rotation = 0;
L.objects.Sprite.prototype.alpha = 1;
L.objects.Sprite.prototype.speedX = 0;
L.objects.Sprite.prototype.speedY = 0;
L.objects.Sprite.prototype.accelX = 0;
L.objects.Sprite.prototype.accelY = 0;
L.objects.Sprite.prototype.visible = true;
L.objects.Sprite.prototype.isClickable = true;


//Sprite Instance Methods

/**
 * Sets the sprite's handle coordinates to x and y
 * @method
 * @param {number} x
 * @param {number} y
 * @returns {L.objects.Sprite}
 */
L.objects.Sprite.prototype.setHandle = function(x, y)
{
    this.handle = {
	x: x,
	y: y
    };
    return this;
};

//Fix name in personal code
L.objects.Sprite.prototype.setHandleXY = L.objects.Sprite.prototype.setHandle;

/**
 * Sets the sprite's proportinal scaling value. Currently only
 * accepts on value
 * @method
 * @param {number} scale
 * @returns {L.objects.Sprite}
 */
L.objects.Sprite.prototype.setScale = function(scale)
{
    this.scale = {
	x: scale,
	y: scale
    };
    return this;
};

/**
 *
 * Multiplies the sprite's scale by a scalar
 * @method
 * @param {number} scalar
 * @returns {L.objects.Sprite}
 */
L.objects.Sprite.prototype.multiplyScale = function(scalar)
{
    this.scale = {
	x: scalar * this.scale.x,
	y: scalar * this.scale.y
    };
    return this;
};

L.objects.Sprite.prototype.flipHorizontal = function()
{
    this.scale.x *= -1;
    return this;
};
L.objects.Sprite.prototype.flipVertical = function()
{
    this.scale.y *= -1;
    return this;
};
L.objects.Sprite.prototype.getX = function()
{
    return this.x + this.offset.x;
};
L.objects.Sprite.prototype.getY = function()
{
    return this.y + this.offset.y;
};
L.objects.Sprite.prototype.getScreenX = function()
{
    var currentScene = L.system.currentScene;
    return this.x + this.offset.x - (currentScene.camera.x * currentScene.activeLayer.scrollRateX);
};
L.objects.Sprite.prototype.getScreenY = function()
{
    var currentScene = L.system.currentScene;
    return this.y + this.offset.y - (currentScene.camera.y * currentScene.activeLayer.scrollRateY);
};

L.objects.Sprite.prototype.autoDraw = function(layer)
{
    if (!this.visible || (this.alpha) <= 0.0) {
	return;
    }
    var angle = this.angle;
    var screenX = this.getScreenX();
    var screenY = this.getScreenY();
    var scale = this.scale;
    var texture = this.texture;
    layer.globalAlpha = this.alpha;

    if (true)
    {
	layer.save();
	layer.translate(screenX, screenY);
	layer.scale(scale.x, scale.y);
	layer.rotate(-angle);


	layer.drawImage(texture, -this.handle.x, -this.handle.y);
	layer.restore();
    } else {
	// layer.scale(1/this.scale,1/this.scale);
	layer.drawImage(this.animations[this.currentAnimation][this.currentFrame].img, this.x - this.handle.x, this.y - this.handle.y);
	//layer.scale(this.scale,this.scale);
    }
    return this;
};
L.objects.Sprite.prototype.draw = L.objects.Sprite.prototype.autoDraw;

L.objects.Sprite.prototype.autoDrawCustom = function(layer, options) // do not use
{
    layer.globalAlpha = (options && options.opacity !== undefined) ? options.opacity : this.alpha;
    if (this.alpha > 0.0 && this.visible)
    {
	if (this.angle !== 0)
	{
	    layer.save();
	    layer.translate(this.x, this.y);
	    layer.rotate(-this.angle);

	    layer.drawImage((options && options.texture !== undefined) ? options.texture : this.animations.idle[this.currentFrame].img, -this.handle.x, -this.handle.y);
	    layer.restore();
	} else {

	    layer.drawImage((options && options.texture !== undefined) ? options.texture : this.animations.idle[this.currentFrame].img, this.x - this.handle.x, this.y - this.handle.y);

	}
    }
};
L.objects.Sprite.prototype.drawBoundingBox = function(layer, strokeStyle, lineWidth)
{
    layer.beginPath();
    this.getVertices();
    layer.moveTo(this.vertices[3][0], this.vertices[3][1]);
    for (var i = 0; i < 4; i++)
    {
	layer.lineTo(this.vertices[i][0], this.vertices[i][1]);
    }
    layer.closePath();
    layer.strokeStyle = strokeStyle || "#FFFFFF";
    layer.lineWidth = lineWidth || 2;
    layer.stroke();
    return this;
};

L.objects.Sprite.prototype.autoUpdate = function(dt)
{
    var timeScale = L.system.timeScale;
    this.speedX += this.accelX * dt * timeScale;
    this.speedY += this.accelY * dt * timeScale;
    this.x += this.speedX * dt * timeScale;
    this.y += this.speedY * dt * timeScale;
    this.rotation += this.rotationAccel * dt * timeScale;
    this.angle += this.rotation * dt * timeScale;
};

L.objects.Sprite.prototype.handleClick = function(mouseX, mouseY, e)
{
    if (this.isClickable)
    {
	var scale = this.scale;
	var screenX = this.getScreenX();
	var screenY = this.getScreenY();
	if (this.angle === 0)
	{
	    var left = screenX - (scale.x * this.handle.x);
	    var right = left + (scale.x * this.width);
	    var top = screenY - (scale.y * this.handle.y);
	    var bottom = top + (scale.y * this.height);

	    if (left > right)
	    {
		var temp = left;
		left = right;
		right = temp;
	    }

	    if (top > bottom)
	    {
		var temp = top;
		top = bottom;
		bottom = temp;
	    }

	    if (
	    mouseX >= left &&
	    mouseX <= right &&
	    mouseY >= top &&
	    mouseY <= bottom
	    )
	    {
		if (this.isClickedPrecise(mouseX, mouseY))
		{
		    if (e.type === "mousedown" || e.type === "touchstart")
		    {
			this.onClick(mouseX, mouseY, e);

			return true;
		    }
		}
	    }
	}
	else if (
	this.angle !== 0 &&
	Math.jordanCurve(mouseX, mouseY, this.getVertices()))
	{

	    if (this.isClickedPrecise(mouseX, mouseY))
	    {

		if (e.type === "mousedown" || e.type === "touchstart")
		{
		    this.onClick(mouseX, mouseY, e);

		    return true;
		}
	    }
	}
    }
};

/**
 * Checks if non-empty sprite pixels exist at specific screen coordinates
 * @method
 * @param {number} mouseX
 * @param {number} mouseY
 * @returns {Boolean}
 */
L.objects.Sprite.prototype.isClickedPrecise = function(mouseX, mouseY)
{

    var layer = L.system.pixelContext[0];
    layer.clearRect(-1, -1, 3, 3);
    layer.save();
    layer.translate(-mouseX, -mouseY);
    this.autoDraw(layer);
    layer.restore();
    var pixelData = layer.getImageData(0, 0, 1, 1).data;
    return (pixelData[3] !== 0);
};


L.objects.Sprite.prototype.getSpeedX = function()
{
    return Math.vectorX(this.speed, this.direction);
};

L.objects.Sprite.prototype.getSpeedY = function()
{
    return Math.vectorY(this.speed, this.direction);
};

L.objects.Sprite.prototype.applyForce = function(speed, direction)
{
    var x1 = this.getSpeedX();
    var y1 = this.getSpeedY();
// var d1 = this.direction;

    var x2 = Math.vectorX(speed, direction); // * L.system.dt* L.system.timeScale;
    var y2 = Math.vectorY(speed, direction); // * L.system.dt * L.system.timeScale;
//var d2 = direction;


    var adj = x1 + x2;
    var opp = y1 + y2;
    var length = Math.pow((Math.pow(adj, 2) + Math.pow(opp, 2)), 1 / 2);
    var angle = Math.radToDeg(Math.atan2(-opp, adj));
//alert(length);
    this.direction = angle;
    this.speed = length;
};

L.objects.Sprite.prototype.moveTo = function(coords)
{
    this.x = coords.x;
    this.y = coords.y;
};
L.objects.Sprite.prototype.moveToX = function(x)
{
    this.x = x;
};
L.objects.Sprite.prototype.move = function(coords)
{
    this.x += coords.x;
    this.y += coords.y;
};
L.objects.Sprite.prototype.moveX = function(x)
{
    this.move({
	x: x,
	y: 0
    });
};
L.objects.Sprite.prototype.moveY = function(y)
{
    this.move({
	x: 0,
	y: y
    });
};

L.objects.Sprite.prototype.centerHandle = function()
{
    this.handle = {
	x: this.center.x,
	y: this.center.y
    };
};

L.objects.Sprite.prototype.pushProperties = function(obj, propertiesArray)
{
    var arrayLength = propertiesArray.length;
    for (var i = 0; i < arrayLength; i++)
    {
	obj[propertiesArray[i]] = this[propertiesArray[i]];
    }
};

L.objects.Sprite.prototype.pushPosition = function(obj)
{
    obj.x = this.x;
    obj.y = this.y;
    obj.offset = {
	x: this.offset.x,
	y: this.offset.y
    };
};

/*
 * Needs rewrite:
 * Was trying to keep method from creating too many new objects,
 * but it would be much cleaner to just have this method
 * return an array of points, so that the method can be near
 * identical on all polygonal objects
 */
L.objects.Sprite.prototype.getVertices = function()
{
    var Math = window.Math;
    var xTransform = this.getScreenX() + this.offset.x;
    var yTransform = this.getScreenY() + this.offset.y;
    var length = this.nudeVertices.length;
    var angle = this.angle;
    var scale = this.scale;
    if (angle !== 0)
    {
	for (var i = 0; i < length; i++)
	{
	    this.vertices[i] = [
		(this.nudeVertices[i][0] - this.handle.x) * Math.cos(-angle) - (this.nudeVertices[i][1] - this.handle.y) * Math.sin(-angle),
		(this.nudeVertices[i][0] - this.handle.x) * Math.sin(-angle) + (this.nudeVertices[i][1] - this.handle.y) * Math.cos(-angle)
	    ];
	}
    }
    else
    {
	for (var i = 0; i < length; i++)
	{
	    this.vertices[i] = [this.nudeVertices[i][0] - this.handle.x, this.nudeVertices[i][1] - this.handle.y];
	}
    }

    this.vertices.mapQuick(function(entry) {
	entry[0] = (entry[0] * scale.x) + xTransform;
	entry[1] = (entry[1] * scale.y) + yTransform;
    });
    return this.vertices;
};
L.Frame = function(textureName, length)
{
    this.img = L.texture[textureName];
    this.length = length;
};
L.Animation = function(frames)
{

};

L.objects.Sprite.prototype.experimentalUpdate = function(dt)
{
//alert(this.landingTime);
    var L = L;
    this.time += dt * L.system.timeScale;
    var Math = Math;
    if (this.time >= this.landingTime)
    {

	if (this.energy < 1)
	{
	    this.energy = 0;
	}
//this.energy *= 1.01;
	this.direction = Math.PI / 2;
	this.y0 = 0;
	this.v = Math.sqrt((this.g * 2 * this.energy) / (Math.pow(Math.sin(this.direction), 2)));
	this.time -= this.landingTime;
	this.landingTime = (this.v * Math.sin(this.direction) + Math.sqrt(Math.pow((this.v * Math.sin(this.direction)), 2) + (2 * this.g * this.y0))) / this.g;
    }


    if (this.landingTime < dt * L.system.timeScale)
    {
	this.y = 500;
    } else {
	this.y = 500 - this.y0 - (this.v * Math.sin(this.direction) * this.time - (this.g * this.time * this.time / 2));
    }
    if (this.y >= 500) {
	this.y = 500;
    }

    this.nextY = this.y;
    this.nextSpeedX += this.accelX * dt * L.system.timeScale;
//  this.nextSpeedY += this.accelY * dt * L.system.timeScale;

    this.nextX += this.nextSpeedX * L.system.dt * L.system.timeScale;
//   this.nextY += this.nextSpeedY * L.system.dt * L.system.timeScale;


    if (this.nextX >= 800)
    {
	this.nextSpeedX = -this.speedX;
	this.speedX = -this.speedX;
	this.nextX = 799;
    }
    if (this.nextX <= 49)
    {
	this.nextSpeedX = -this.speedX;
	this.speedX = -this.speedX;
	this.nextX = 50;
    }
//    this.y = (this.nextY);
    this.x = (this.nextX);
//   this.speedY = (this.nextSpeedY);
    this.speedX = (this.nextSpeedX);
//  }

//  this.x += 1;
// this.y += 1;


};;


L.objects.Layer = function(name)
{
    this.name = name;
    this.sorted = false;
    this.sortBy = ["z"];
    this.sortOrder = [1];
    this.objects = [];
    this.targetContext = L.system.bufferContext[0];
    this.layerAlpha = 1;
    this.isClickable = true;
    this.scrollRateX = 1;
    this.scrollRateY = 1;
    this.visible = true;
    this.updating = true;
};



L.objects.Layer.prototype.autoDraw = function(camera)
{
    //this.objects.draw(this.targetContext,camera);
if (!this.visible)
{
    return;
}
    var objectsToDraw = this.objects;
    var length = objectsToDraw.length;
    var currentObject={};
    for (var i = 0; i < length; i++)
    {
	currentObject=objectsToDraw[i];
	if (currentObject && currentObject.draw)
	{
	    currentObject.draw(this.targetContext,camera);
	}
    }

};

L.objects.Layer.prototype.draw = L.objects.Layer.prototype.autoDraw;



L.objects.Layer.prototype.autoUpdate = function(dt)
{
    if (!this.updating)
    {
	return;
    }
    this.objects.update(dt);

    if (this.sorted)
    {
	var length = this.sortBy.length;
	for (var i = 0; i < length; i++)
	{
	    this.objects.sortBy(this.sortBy[i], this.sortOrder[i]);
	}
    }

};

L.objects.Layer.prototype.update = L.objects.Layer.prototype.autoUpdate;


L.objects.Layer.prototype.handleClick = function(mouseX, mouseY, e)
{

    if (this.isClickable)
    {
	this.objects.handleClick(mouseX, mouseY, e);
    }
};

L.objects.Layer.prototype.addObject = function(object)
{
    this.objects.push(object);
};

L.objects.Layer.prototype.addObjects = function()
{
    var objectsLength = arguments.length;
    for (var i = 0; i < objectsLength; i++)
    {
	this.addObject(arguments[i]);
    }
};

;
/* global L */

/**
 * Creates a new Scene object.  The scene comes with an empty keymap object and one layer called "background"
 * @constructor
 * @param {string} name - The name of the scene
 * @return {L.objects.Scene}
 */
L.objects.Scene = function(name)
{

    this.name = name;

    L.scenes[name] = this;
    this.layers = {
	"background": new L.objects.Layer("background")
    };
    this.layerOrder = ["background"];
    this.bgFill = "blueviolet";
    this.alpha = 1;
    this.keymap = new L.keyboard.Keymap();

    this.activeLayer = {};
    this.camera = {
	x: 0,
	y: 0,
	angle: 0,
	zoom: 1
    };
};

L.objects.Scene.prototype.doKeyDown = function(event)
{
    if (this.keymap.doKeyDown !== undefined)
    {
	this.keymap.doKeyDown(event);
    }
};

L.objects.Scene.prototype.doKeyUp = function(event)
{
    if (this.keymap.doKeyUp !== undefined)
    {
	this.keymap.doKeyUp(event);
    }
};
/**
 * @method
 * @param {float} dt - Delta time
 * @returns {L.objects.Scene} Scene
 */
L.objects.Scene.prototype.autoUpdate = function(dt)
{
    var layerOrder = this.layerOrder;
    var length = layerOrder.length;
    for (var i = 0; i < length; i++)

    {
	var currentLayer = this.layers[layerOrder[i]];
	this.activeLayer = currentLayer;
	currentLayer.update(dt);
    }
    return this;
};
L.objects.Scene.prototype.update = L.objects.Scene.prototype.autoUpdate;

L.objects.Scene.prototype.autoDraw = function()
{
    var system = L.system;
    var layer = system.bufferContext[0];
    var renderContext = system.renderContext[0];
    var width = system.width;
    var height = system.height;
    if (layer.fillStyle !== this.bgFill)
    {
    layer.fillStyle = this.bgFill;
    }
    layer.fillRect(0, 0, width, height);
    var layerOrder = this.layerOrder;
    var length = layerOrder.length;
    for (var i = 0; i < length; i++)
    {
	var currentLayer = this.layers[layerOrder[i]];
	this.activeLayer = currentLayer;
	currentLayer.draw(this.camera);
    }
    if (layer.globalAlpha !== 1)
    {
	layer.globalAlpha = 1;
    }
    if (renderContext.globalAlpha !== this.alpha)
    {
	renderContext.globalAlpha = this.alpha;
    }
    renderContext.drawImage(system.bufferCanvas[0], 0, 0, width, height);
};

L.objects.Scene.prototype.draw = L.objects.Scene.prototype.autoDraw;

L.objects.Scene.prototype.newLayer = function(name)
{
    var newLayer = new L.objects.Layer(name);
    this.layers[name] = newLayer;
    this.layerOrder.push(name);
    return newLayer;

};

L.objects.Scene.prototype.addLayer = L.objects.Scene.prototype.newLayer;

L.objects.Scene.prototype.addLayerObject = function(layer)
{

    this.layers[layer.name] = layer;
    this.layerOrder.push(layer.name);

};

/**
 *
 * @param {Object} object
 * @param {string} layerName
 * @returns {L.objects.Layer}
 */
L.objects.Scene.prototype.addObjectToLayer = function(object, layerName)
{
    this.layers[layerName].addObject(object);
    return this;
};

L.objects.Scene.prototype.handleClick = function(mouseX, mouseY, e)
{
    var layerOrder = this.layerOrder;
    var length = layerOrder.length;
    for (var i = 0; i < length; i++)
    {
	var currentLayer = this.layers[layerOrder[i]];
	this.activeLayer = currentLayer;
	currentLayer.handleClick(mouseX, mouseY, e);
    }
};


L.objects.Scene.prototype.transition = {};

L.objects.Scene.prototype.transition.fadeToColor = function(nextScene, fadeOut, pause, fadeIn, color, callback)
{

    L.transitions.fadeToColor.play(L.system.currentScene, nextScene, fadeOut, pause, fadeIn, color, callback);
};

L.objects.Scene.prototype.transition.fadeToBlack = function(nextScene, fadeOut, pause, fadeIn, callback)
{

    L.transitions.fadeToColor.play(L.system.currentScene, nextScene, fadeOut, pause, fadeIn, "#000000", callback);
};

L.objects.Scene.prototype.transition.instant = function(nextScene, callback)
{

    L.transitions.instant.play(L.system.currentScene, nextScene, callback);
};

/**
 * Instructs the engine to switch to this scene before the next frame is rendered
 * @method
 * @returns {L.objects.Scene}
 */
L.objects.Scene.prototype.setScene = function()
{
    var system = L.system;
    system.previousScene = system.currentScene;
    system.nextScene = this;
    return this;
};;
/* global L */
L.objects.Textbox = function(text, x, y, width, height, wordwrap)
{


    this.width = (width === undefined) ? 200 : width;
    this.height = height;

    this.words = (text === undefined) ? [] : text.split(" ");
    this.textArray = [];
    Object.defineProperty(this, "text", {
	set: function(text)
	{
	    this.words = text.split(" ");
	    // this.autoSizeX();
	    this.wrapText();
	}.bind(this),
	get: function() {
	    return this.words.join(" ");
	}.bind(this)
    });



    this.x = (x === undefined) ? 0 : x;
    this.y = (y === undefined) ? 0 : y;
    this.alpha = 1;
    this.font = "Times";
    this.fontSize = 30;
    this.lineSpacing = 1;

    this.handle = {};
    this.handle.x = 0;
    this.handle.y = 0;

    this.angle = 0;
    this.scale = 1;

    this.speedX = 0;
    this.speedY = 0;
    this.accelX = 0;
    this.accelY = 0;
    this.rotation = 0;

    this.textFill = "#000000";
    this.textStrokeStyle = "";
    this.textLineWidth = "2";
    this.wrap = true;
    this.alignment = "left";
    this.alignmentY = "top";
    //this.textBaseline = "bottom";



    this.backgroundFill = "#FFFFFF";
    this.borderFill = "";
    this.borderWidth = 0;

    this.marginLeft = 5;
    this.marginTop = 5;
    this.marginRight = 5;
    this.marginBottom = 5;

    this.visible = true;
    this.isClickable = true;
};

L.objects.Textbox.prototype.draw = function(layer)
{
    this.autoDraw(layer);

};

L.objects.Textbox.prototype.autoDraw = function(layer)
{
    if (!this.visible) {
	return;
    }
    layer.globalAlpha = this.alpha;
    var drawBox = (this.backgroundFill !== "" && this.borderWodth > 0);
    layer.textAlign = "left";//this.alignment;
    layer.font = this.fontSize + "px " + this.font;
    if (!this.height)
    {
	this.height = this.fontSize;
    }
    var arrayLength = this.textArray.length;
    if (this.angle !== 0)
    {
	var radians = this.angle;
	layer.save();
	layer.translate(this.x, this.y);
	layer.rotate(-radians);

	if (drawBox) {

	    layer.beginPath();

	    layer.rect(-this.handle.x, -this.handle.y, this.width + this.marginLeft + this.marginRight, this.height + this.marginTop + this.marginBottom + (this.fontSize * (arrayLength - 1) * this.lineSpacing));
	    if (this.backgroundFill !== "")
	    {
		layer.fillStyle = this.backgroundFill;
		layer.fill();
	    }
	    if (this.borderWidth > 0)
	    {
		layer.strokeStyle = this.borderFill;
		layer.lineWidth = this.borderWidth;
		layer.stroke();
	    }
	}
	layer.fillStyle = this.textFill;
	layer.textBaseline = "bottom";
	for (var i = 0; i < arrayLength; i++)
	{
	    var text = this.textArray[i];
	    var xPos = this.marginLeft - this.handle.x;
	    var yPos = this.marginTop + this.fontSize - this.handle.y + (this.fontSize * i * this.lineSpacing);
	    if (this.scale !== 1)
	    {
		layer.save();
		layer.translate(this.x, this.y);
		layer.scale(this.scale, this.scale);
		layer.translate(-this.x, -this.y);
	    }

	    if (this.textStrokeStyle !== "")
	    {
		layer.lineWidth = this.textLineWidth;
		layer.strokeStyle = this.textStrokeStyle;
		layer.strokeText(text, xPos, yPos);
	    }
	    layer.fillText(text, xPos, yPos);
	    if (this.scale !== 1)
	    {
		layer.restore();
	    }
	}



	//layer.fillText(this.text, 0, 0);
	layer.restore();
    } else {
	if (drawBox)
	{
	    layer.beginPath();
	    layer.rect(this.x - this.handle.x, this.y - this.handle.y, this.width + this.marginLeft + this.marginRight, this.height + this.marginTop + this.marginBottom + (this.fontSize * (arrayLength - 1) * this.lineSpacing));
	    if (this.backgroundFill !== "")
	    {
		layer.fillStyle = this.backgroundFill;
		layer.fill();
	    }
	    if (this.borderWidth > 0)
	    {
		layer.strokeStyle = this.borderFill;
		layer.lineWidth = this.borderWidth;
		layer.stroke();
	    }
	}
	layer.fillStyle = this.textFill;
	layer.textBaseline = "bottom";

	for (var i = 0; i < arrayLength; i++)
	{
	    var text = this.textArray[i];
	    var xPos = this.x + this.marginLeft - this.handle.x;
	    var yPos = this.y + this.marginTop + this.fontSize - this.handle.y + (this.fontSize * i * this.lineSpacing);
	    if (this.scale !== 1)
	    {
		layer.save();
		layer.translate(this.x, this.y);
		layer.scale(this.scale, this.scale);
		layer.translate(-this.x, -this.y);
	    }

	    if (this.textStrokeStyle !== "")
	    {
		layer.lineWidth = this.textLineWidth;
		layer.strokeStyle = this.textStrokeStyle;
		layer.strokeText(text, xPos, yPos);
	    }
	    layer.fillText(text, xPos, yPos);
	    if (this.scale !== 1)
	    {
		layer.restore();
	    }
	}
    }
};


L.objects.Textbox.prototype.update = function(dt)
{
    this.autoUpdate(dt);
};

L.objects.Textbox.prototype.autoUpdate = function(dt)
{

};

L.objects.Textbox.prototype.autoSize = function()
{
    this.autoSizeX();
    this.autoSizeY();
    this.wrapText();
};

L.objects.Textbox.prototype.autoSizeX = function()
{
    this.width = this.getTextWidth();
    this.realign();
};

L.objects.Textbox.prototype.autoSizeY = function()
{
    this.height = this.fontSize;
};

L.objects.Textbox.prototype.wrapText = function()
{
    var arrayLength = this.words.length;
    this.textArray = [];
    var currentLineNumber = 0;
    var currentLineText = "";
    var textBoxWidth = this.width;
    for (var i = 0; i < arrayLength; i++)
    {
	var currentLineWidth = this.getTextWidth(currentLineText);
	if (currentLineWidth === 0)
	{
	    currentLineText = this.words[i];
	}
	else if (this.getTextWidth(currentLineText + " " + this.words[i]) <= textBoxWidth)
	{
	    currentLineText += " " + this.words[i];
	}
	else
	{
	    this.textArray[currentLineNumber] = currentLineText;
	    currentLineNumber++;
	    currentLineText = this.words[i];
	    //  alert(this.words[i]);
	}

    }
    this.textArray[currentLineNumber] = currentLineText;
};

L.objects.Textbox.prototype.getTextWidth = function(text)
{
    var buffer = L.system.bufferContext[0];
    buffer.font = this.fontSize + "px " + this.font;
    if (text === "")
    {
	return 0;
    }
    var metrics = buffer.measureText(text ? text : this.text);
    return metrics.width;
};

L.objects.Textbox.prototype.getTotalWidth = function()
{
    return (this.width + this.marginLeft + this.marginRight);
};

L.objects.Textbox.prototype.getTotalHeight = function()
{
    return (this.height + this.marginTop + this.marginBottom);
};

L.objects.Textbox.prototype.realign = function()
{
    this[this.alignment]();
    this[this.alignmentY]();
};

L.objects.Textbox.prototype.center = function()
{
    this.handle.x = (this.getTotalWidth() / 2);
    this.alignment = "center";
    return this;
};

L.objects.Textbox.prototype.centerY = function()
{
    this.handle.y = (this.getTotalHeight() / 2);
    this.alignmentY = "centerY";
    return this;
};

L.objects.Textbox.prototype.top = function()
{
    this.handle.y = 0;
    this.alignmentY = "top";
    return this;
};

L.objects.Textbox.prototype.bottom = function()
{
    this.handle.y = this.getTotalHeight();
    this.alignmentY = "bottom";
    return this;
};

L.objects.Textbox.prototype.left = function()
{
    this.handle.x = 0;
    this.alignment = "left";
    return this;
};

L.objects.Textbox.prototype.right = function()
{
    this.handle.x = this.getTotalWidth();
    this.alignment = "right";
    return this;
};

L.objects.Textbox.prototype.setMargins = function()
{
    switch (arguments.length)
    {
	case 1:
	    this.marginLeft = this.marginTop = this.marginRight = this.marginBottom = arguments[0];
	    break;
	case 2:
	    this.marginTop = this.marginBottom = arguments[0];
	    this.marginLeft = this.marginRight = arguments[1];
	    break;
	case 3:
	    this.marginTop = arguments[0];
	    this.marginRight = this.marginLeft = arguments[1];
	    this.marginBottom = arguments[2];
	    break;
	case 4:
	    this.marginTop = arguments[0];
	    this.marginRight = arguments[1];
	    this.marginBottom = arguments[2];
	    this.marginLeft = arguments[3];
	    break;
	default:
	    alert("Textbox.setMargins() called with wrong number of arguments.");
	    break;

    }
    this.realign();
    return this;
};

L.objects.Textbox.prototype.handleClick = function(mouseX, mouseY, e)
{
    if (this.isClickable)
    {
	if ((this.angle === 0 &&
	mouseX >= this.x - this.handle.x &&
	mouseX <= this.x + this.width + this.marginLeft + this.marginRight - this.handle.x &&
	mouseY >= this.y - this.handle.y &&
	mouseY <= this.y + this.height + this.marginTop + this.marginBottom - this.handle.y + (this.fontSize * (this.textArray.length - 1) * this.lineSpacing)
	) || (
	this.angle !== 0 &&
	Math.jordanCurve(mouseX, mouseY, this.getVertices())))
	{
	    if (e.type === "mousedown" || e.type === "touchstart")
	    {
		this.onClick(mouseX, mouseY, e);

		return true;
	    }

	}
    }
};

L.objects.Textbox.prototype.getVertices = function()
{
    var Math = window.Math;
    var xTransform = this.x;// + this.offset.x;
    var yTransform = this.y;// + this.offset.y;
    var scale = this.scale;
    var top = 0 - this.handle.y;
    var left = 0 - this.handle.x;
    var right = left + this.width + this.marginLeft + this.marginRight;
    var bottom = top + this.height + this.marginTop + this.marginBottom + (this.fontSize * (this.textArray.length - 1) * this.lineSpacing);
    var vertices = [[left, top], [right, top], [right, bottom], [left, bottom]];

    if (this.scale !== 1)
    {
	vertices.mapQuick(function(entry) {
	    entry[0] *= scale;
	    entry[1] *= scale;
	});

    }
    if (this.angle !== 0)
    {
	var length = vertices.length;

	for (var i = 0; i < length; i++)
	{
	    vertices[i] = [
		vertices[i][0] * Math.cos(-this.angle) - vertices[i][1] * Math.sin(-this.angle),
		vertices[i][0] * Math.sin(-this.angle) + vertices[i][1] * Math.cos(-this.angle)
	    ];
	}
    }


    vertices.mapQuick(function(entry) {
	entry[0] += xTransform;
	entry[1] += yTransform;
    });


    return vertices;

};;

L.transitions = {};

L.transitions.instant = {};

L.transitions.instant.play = function(lastScene, nextScene, callback)
{
    if (lastScene.exit) {
	lastScene.exit();
    }
    if (callback) {
	callback(nextScene);
    }

    L.system.currentScene = nextScene;
};




L.transitions.fadeToColor =
{
    lastScene: {},
    nextScreen: {},
    timer: 0,
    state: "start"
};
L.transitions.fadeToColor.play = function(lastScene, nextScene, fadeOut, pause, fadeIn, color, callback)
{
    this.lastScene = lastScene;
    this.nextScene = nextScene;
    this.camera = lastScene.camera;
    this.currentScene = lastScene;
    this.activeLayer = lastScene.activeLayer;
    this.fadeOut = fadeOut;
    this.pause = pause;
    this.fadeIn = fadeIn;
    this.timer = fadeOut;
    this.state = "start";
    this.color = color || "#000000";
    this.callback = callback || function() {
    };
    L.system.currentScene = this;


};

L.transitions.fadeToColor.update = function(dt)
{
    switch (this.state)
    {
	case "start":
	    this.timer = this.fadeOut;
	    this.lastScene.update(dt);
	    this.state = "fadeOut";
	    break;
	case "fadeOut":
	    this.timer -= dt;
	    this.lastScene.update(dt);
	    if (this.timer <= 0)
	    {
		this.timer = this.pause;
		this.callback(this.nextScene);
		this.state = "pause";
	    }
	    break;
	case "pause":
	    this.timer -= dt;
	    if (this.timer <= 0)
	    {
		this.camera = this.nextScene.camera;
		this.timer = this.fadeIn;
		this.state = "fadeIn";
	    }
	    break;
	case "fadeIn":
	    this.timer -= dt;
	    this.nextScene.update(dt);
	    if (this.timer <= 0)
	    {
		L.system.currentScene = this.nextScene;
	    }
	    break;
	default:
	    alert("Hey!");
	    break;
    }
};

L.transitions.fadeToColor.draw = function()
{
    switch (this.state)
    {
	case "start":
	case "fadeOut":
	    this.lastScene.draw();
	    L.system.renderContext[0].fillStyle = this.color;
	    L.system.renderContext[0].globalAlpha = 1 - this.timer / this.fadeOut;
	    L.system.renderContext[0].fillRect(0, 0, L.system.width, L.system.height);
	    break;
	case "pause":
	    L.system.renderContext[0].fillStyle = this.color;
	    L.system.renderContext[0].globalAlpha = 1;
	    L.system.renderContext[0].fillRect(0, 0, L.system.width, L.system.height);
	    break;
	case "fadeIn":
	    this.nextScene.draw();
	    L.system.renderContext[0].fillStyle = this.color;
	    L.system.renderContext[0].globalAlpha = this.timer / this.fadeIn;
	    L.system.renderContext[0].fillRect(0, 0, L.system.width, L.system.height);
	    break;
	default:
	    alert("hey!");
	    break;

    }
};;
/* global L*/

/**
 *
 * A namespace for keyboard controls
 * @namespace L.keyboard
 */
L.keyboard = {};

/**
 * In place for backwards compatibility
 * @deprecated
 * @type @exp;L@pro;keyboard
 */
L.input = L.keyboard;

/**
 *
 * Takes a string representing a keyboard button and resturns the corresponding key code.
 * @function
 * @param {string} keyString
 * @returns {Number} Keyboard keycode
 */
L.keyboard.keyCodeFromString = function(keyString)
{
    var upString = keyString.toUpperCase().replace(" ", "");
    if (upString.match(/^[A-Z0-9]$/))
    {
	return upString.charCodeAt(0);
    }

    if (upString.indexOf("NUMPAD") === 0)
    {
	return 96 + parseInt(upString.charAt(upString.length - 1));
    }

    if (upString.indexOf("F") === 0)
    {
	return 111 + parseInt(upString.replace("F", ""));
    }

    switch (upString)
    {
	case "ANY":
	case "ALL":
	    return 0;
	    break;

	case "MULTIPLY":
	    return 106;
	    break;

	case "ADD":
	    return 107;
	    break;

	case "ENTER":
	    return 13;
	    break;

	case "SUBTRACT":
	    return 109;
	    break;

	case "DECIMAL":
	    return 110;
	    break;

	case "DIVIDE":
	    return 111;
	    break;

	case "BACKSPACE":
	case "BACK":
	    return 8;
	    break;

	case "TAB":
	    return 9;
	    break;

	case "SHIFT":
	    return 16;
	    break;

	case "CONTROL":
	case "CTRL":
	    return 17;
	    break;

	case "CAPS":
	case "CAPSLOCK":
	    return 20;
	    break;

	case "ESC":
	case "ESCAPE":
	    return 27;
	    break;

	case "SPACE":
	case "SPACEBAR":
	    return 32;
	    break;

	case "PGUP":
	case "PAGEUP":
	    return 33;
	    break;

	case "PGDN":
	case "PAGEDOWN":
	    return 34;
	    break;

	case "END":
	    return 35;
	    break;

	case "HOME":
	    return 36;
	    break;

	case "LEFT":
	case "LEFTARROW":
	    return 37;
	    break;

	case "UP":
	case "UPARROW":
	    return 38;
	    break;

	case "RIGHT":
	case "RIGHTARROW":
	    return 39;
	    break;

	case "DOWN":
	case "DOWNARROW":
	    return 40;
	    break;

	case "INSERT":
	    return 45;
	    break;

	case "DELETE":
	    return 46;
	    break;

	case "NUMLOCK":
	    return 144;
	    break;

	case "SCRLK":
	case "SCROLLLOCK":
	    return 145;
	    break;

	case "PAUSE":
	case "PAUSEBREAK":
	    return 19;
	    break;

	case ";":
	case ":":
	    return 186;
	    break;

	case "=":
	case "+":
	    return 187;
	    break;

	case "-":
	case "_":
	    return 198;
	    break;

	case "/":
	case "?":
	    return 191;
	    break;

	case "~":
	case "`":
	    return 192;
	    break;

	case "[":
	case "{":
	    return 219;
	    break;

	case "\\":
	case "|":
	case "BACKSLASH":
	    return 220;
	    break;

	case "]":
	case "}":
	    return 221;
	    break;

	case "'":
	case '"':
	case "QUOTE":
	case "QUOTES":
	    return 222;
	    break;

	case ",":
	case "<":
	    return 188;
	    break;

	case ".":
	case ">":
	    return 190;
	    break;

	default:
	    alert("'" + keyString + "' is not a valid key identifier.");
	    break;
    }
};

/**
 * Holds an array of pressed keyboard buttons
 * @type Array
 */
L.keyboard.state = [];


/**
 * Checks L.keyboard.state to see if a specific key is down
 * @function
 * @param {type} keyString
 * @returns {Boolean}
 */
L.keyboard.isKeyDown = function(keyString)
{
    var keyboard = L.keyboard;
    var keyCode = keyboard.keyCodeFromString(keyString);
    return (keyboard.state.indexOf(keyCode) !== -1);

};

/**
 * Resets the state of the keyboard, unpressing all buttons
 * @function
 * @returns {L.keyboard}
 */
L.keyboard.reset = function()
{
    L.keyboard.state.length = 0;
    return this;
};

/**
 * Creates a Keymap instance, a keyboard control scheme
 * @constructor
 * @returns {L.keyboard}
 */
L.keyboard.Keymap = function()
{
    this.bindings = {};
    return this;
};

/**
 * This method is called by keymap's parent scene on a keydown event
 * @method
 * @param {event} event
 */
L.keyboard.Keymap.prototype.doKeyDown = function(event)
{
    var keyCode = event.keyCode;
    var bindings = this.bindings;
    var keyboard = L.keyboard;
    if (keyboard.state.indexOf(keyCode) === -1)
    {
	keyboard.state.push(keyCode);
    }
    if (bindings[keyCode] && bindings[keyCode]["keydown"])
    {
	bindings[keyCode]["keydown"]();
    }
    else if (bindings[0] && bindings[0]["keydown"])
    {
	bindings[0]["keydown"]();
    }
};

/**
 * This method is called by keymap's parent scene on a keyup event
 * @method
 * @param {event} event
 */
L.keyboard.Keymap.prototype.doKeyUp = function(event)
{
    var keyCode = event.keyCode;
    var bindings = this.bindings;
    var keyboard = L.keyboard;
    var indexOfKeyCode = keyboard.state.indexOf(keyCode);
    if (indexOfKeyCode !== -1)
    {
	keyboard.state.splice(indexOfKeyCode, 1);
    }
    if (bindings[keyCode] && bindings[keyCode]["keyup"])
    {
	bindings[keyCode]["keyup"]();
    }
    else if (bindings[0] && bindings[0]["keyup"])
    {
	bindings[0]["keyup"]();
    }
};

/**
 * Binds a function to the keyup or keydown event of a keyboard key, specified by name
 * @method
 * @param {string} key
 * @param {string} event
 * @param {function} callback
 * @returns {L.keyboard.Keymap}
 */
L.keyboard.Keymap.prototype.bindKey = function(key, event, callback)
{
    this.bindKeyCode(L.input.keyCodeFromString(key), event, callback);
    return this;
};

/**
 * Binds a function to the keyup or keydown event of a keyboard key, specified by key code
 * @method
 * @param {number} keyCode
 * @param {string} event
 * @param {function} callback
 * @returns {L.keyboard.Keymap}
 */
L.keyboard.Keymap.prototype.bindKeyCode = function(keyCode, event, callback)
{
    if (!this.bindings[keyCode])
    {
	this.bindings[keyCode] = {};
    }
    this.bindings[keyCode][event.toLowerCase()] = callback;
    return this;
};;
//IN PROGRESS



L.objects.Bone = function(textureName, options) {
    L.objects.Sprite.call(this, textureName, options);
    this.inheritPosition = true;
    this.inheritAngle = true;
    this.inheritScale = true;
    this.joint = {
	x: 0,
	y: 0
    };
    this.relAngle = 0;
    this.children = [];


};
L.objects.Bone.prototype = new L.objects.Sprite;
L.objects.Bone.constructor = L.objects.Bone;

L.objects.Bone.prototype.draw = function(layer)
{
    this.autoDraw(layer);
};

L.objects.Bone.prototype.updateBone = function(dt)
{
    var parent = this.parent;
    // this.sceneMap = parent.sceneMap;
    if (this.inheritScale)
    {
	var parentScale = parent.scale;
	this.scale = {
	    x: parentScale.x,
	    y: parentScale.y
	};
    }
    if (this.inheritPosition)
    {
	var parentX = parent.x;
	var parentY = parent.y;
	var scale = this.parent.scale;
	//var jointX = scale.x * (this.joint.x - parent.handle.x);
	//var jointY = scale.y * (this.joint.y - parent.handle.y);
	var jointX = (this.joint.x - parent.handle.x);
	var jointY = (this.joint.y - parent.handle.y);
	if (parent.angle === 0)
	{
	    this.x = parentX + scale.x * (this.joint.x - parent.handle.x);
	    this.y = parentY + scale.y * (this.joint.y - parent.handle.y);
	}
	else
	{
	    var newPosition = Math.rotatePoint(jointX, jointY, this.parent.angle);
	    this.x = newPosition.x * scale.x + parentX;
	    this.y = newPosition.y * scale.y + parentY;
	}
    }
    if (this.inheritAngle)
    {
	this.angle = this.relAngle + parent.angle;

    }
    var numberOfChildren = this.children.length;
    for (var i = 0; i < numberOfChildren; i++)
    {
	this.children[i].updateBone(dt);
	this.children[i].update(dt);
    }
};





L.objects.Skeleton = function(textureName, options)
{
    L.objects.Sprite.call(this, textureName, options);


    this.children = [];
    this.bones = {};
    this.drawOrder = [this];

};

L.objects.Skeleton.prototype = new L.objects.Sprite;
L.objects.Skeleton.constructor = L.objects.Skeleton;

L.objects.Skeleton.prototype.handleClick = function(mouseX, mouseY, e)
{
    var numberOfBones = this.drawOrder.length;


    for (var i = numberOfBones - 1; i >= 0; i--)
    {
	var currentBone = this.drawOrder[i];
	var clickResult;
	if (this !== currentBone)

	{
	    clickResult = currentBone.handleClick(mouseX, mouseY, e);

	}
	else
	{
	    clickResult = L.objects.Sprite.prototype.handleClick.call(this.drawOrder[i], mouseX, mouseY, e);
	}
	if (clickResult)
	{
	    return true;
	}
    }
};
L.objects.Skeleton.prototype.addBone = function(textureName, boneName)
{

    var newBone = new L.objects.Bone(textureName);
    newBone.name = boneName;
    newBone.master = this;
    newBone.parent = this;
    this.children.push(newBone);
    this.bones[boneName] = newBone;
    this.drawOrder.push(newBone);
    return newBone;

};

L.objects.Bone.prototype.addBone = function(textureName, boneName)
{

    var newBone = new L.objects.Bone(textureName);
    newBone.name = boneName;
    newBone.master = this.master;
    newBone.parent = this;
    this.children.push(newBone);
    this.master.bones[boneName] = newBone;
    this.master.drawOrder.push(newBone);
    return newBone;

};

L.objects.Skeleton.prototype.draw = function(layer)
{
    var numberOfLimbs = this.drawOrder.length;
    for (var i = 0; i < numberOfLimbs; i++)
    {
	var currentSprite = this.drawOrder[i];
	if (this === currentSprite)
	{
	    this.autoDraw(layer);
	    this.drawBoundingBox(layer);
	}
	else
	{
	    this.drawOrder[i].draw(layer);
	}
    }
};

L.objects.Skeleton.prototype.update = function(dt)
{
    this.updateBones(dt);
};

L.objects.Skeleton.prototype.updateBones = function(dt)
{
    var numberOfChildren = this.children.length;

    for (var i = 0; i < numberOfChildren; i++)
    {
	var currentBone = this.children[i];
	currentBone.updateBone(dt);
	currentBone.update(dt);

    }
};
;

L.objects.Timeline = function()
{
    this.paused = true;
    this.timer = 0;
    this.length = 0;
    this.eventList = [];
    this.nextEvent = 0;
    this.preserveEvents = true;
    this.stopAfterEvent = 0;
    this.stopAtTime = 0;
};

L.objects.Timeline.prototype.update = function(dt)
{
    if (!this.paused)
    {
	var eventListLength = this.eventList.length;
	this.timer += dt;
	while ((this.nextEvent < eventListLength) && (this.timer >= this.eventList[this.nextEvent][0]))
	{
	    this.eventList[this.nextEvent][1]();
	    this.nextEvent++;
	    if (this.stopAfterEvent !== 0 && this.nextEvent > this.stopAfterEvent-1)
	    {
		this.paused=true;
	    }
	}
    }
};

L.objects.Timeline.prototype.addEvent = function(time, callback)
{
    var eventList = this.eventList;
    var eventListLength = this.eventList.length;
    if (eventListLength === 0 || eventList[eventListLength-1][0] <= time)
    {
	eventList.push([time, callback]);
	return this;
    }
    else
    {
	for (var i = eventListLength-1; i >= 0; i--)
	{
	    if (i === 0)
	    {
		eventList.unshift([time,callback]);
		return this;
	    }
	    if (time < eventList[i][0] && time >= eventList[i-1][0])
	    {
		eventList.splice(i,0,[time, callback]);
		return this;
	    }
	}
    }

};

L.objects.Timeline.prototype.play = function()
{
  this.paused = false;
};

L.objects.Timeline.prototype.pause = function()
{
  this.paused = true;
};

L.objects.Timeline.prototype.togglePause = function()
{
  this.paused = !this.paused;
};

L.objects.Timeline.prototype.reset = function()
{
  this.paused=true;
  this.timer = 0;
  this.nextEvent=0;

};;
/* global L */


L.objects.SpriteMask = function (textureName,red,green,blue,alpha,width,height)
{

    this.red = red;
    this.green = green;
    this.blue = blue;
    var texture = this.sourceTexture = L.textures[textureName];
    var targetWidth = this.width = (width === undefined)?texture.width:width;
    var targetHeight = this.height = (height === undefined)?texture.height:height;

    if ((targetWidth === 0) || (targetHeight === 0))
    {
	alert("Texture '" + texture + "' does not seem to have any dimensions.");
    }

    var maskCanvas = this.texture = document.createElement("canvas");
    maskCanvas.width = targetWidth;
    maskCanvas.height = targetHeight;
    var ctx = this.ctx = maskCanvas.getContext("2d");
    ctx.drawImage(texture,0,0);
      this.imageData = this.ctx.getImageData(0,0,targetWidth,targetHeight);
    this.setColor(red,green,blue,alpha);


};

L.objects.SpriteMask.prototype.saveAs = function(textureName)
{
    L.textures[textureName] = this.texture;
};

L.objects.SpriteMask.prototype.setColor = function(red,green,blue,alpha)
{
var width = this.width;
var height = this.height;
this.red = red;
this.green = green;
this.blue = blue;
    var imageData = this.imageData;//this.ctx.getImageData(0,0,width,height);
    var dataLength = imageData.data.length;
    for (var i = 0; i < dataLength; i+=4)
    {
	imageData.data[i] = red;
	imageData.data[i+1] = green;
	imageData.data[i+2] = blue;
    }
    this.ctx.clearRect(-1,-1,width+1,height+1);

   this.ctx.putImageData(imageData,0,0);
};;
/* global L*/

L.objects.Triangle2D = function(verticesArray)
{
    this.x1 = verticesArray[0][0];
    this.x2 = verticesArray[1][0];
    this.x3 = verticesArray[2][0];

    this.y1 = verticesArray[0][1];
    this.y2 = verticesArray[1][1];
    this.y3 = verticesArray[2][1];

    this.stroke = true;
    this.lineWidth = 1;
    this.strokeStyle = "#FF0000";

    this.fill = false;
    this.fillStyle = "#FFFFFF";
};

L.objects.Triangle2D.prototype.draw = function(ctx)
{

    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.lineTo(this.x3, this.y3);
    ctx.closePath();
    if (this.stroke)
    {
	if (this.lineWidth !== ctx.lineWidth)
	{
	    ctx.lineWidth = this.lineWidth;
	}
	if (this.strokeStyle !== ctx.strokeStyle)
	{
	    ctx.strokeStyle = this.strokeStyle;
	}
	ctx.stroke();
    }

};

L.objects.Triangle2D.prototype.findIncenter = function()
{

};

L.objects.Triangle2D.prototype.growBy = function(distance, clampLimit)
{
    var side1 = Math.sqrt(Math.pow(this.x2 - this.x3, 2) + Math.pow(this.y2 - this.y3, 2));
    var side2 = Math.sqrt(Math.pow(this.x3 - this.x1, 2) + Math.pow(this.y3 - this.y1, 2));
    var side3 = Math.sqrt(Math.pow(this.x1 - this.x2, 2) + Math.pow(this.y1 - this.y2, 2));

    // var slope1 =

    var angle1 = Math.acos((side2 * side2 + side3 * side3 - side1 * side1) / (2 * side2 * side3));
    var angle2 = Math.acos((side3 * side3 + side1 * side1 - side2 * side2) / (2 * side3 * side1));
    var angle3 = Math.acos((side1 * side1 + side2 * side2 - side3 * side3) / (2 * side1 * side2));

    var incenterX = (this.x1 * side1 + this.x2 * side2 + this.x3 * side3) / (side1 + side2 + side3);
    var incenterY = (this.y1 * side1 + this.y2 * side2 + this.y3 * side3) / (side1 + side2 + side3);

    var distance1 = distance / Math.sin(angle1 / 2);
    var distance2 = distance / Math.sin(angle2 / 2);
    var distance3 = distance / Math.sin(angle3 / 2);

    var distanceToIC1 = Math.sqrt(Math.pow(this.x1 - incenterX, 2) + Math.pow(this.y1 - incenterY, 2));
    var distanceToIC2 = Math.sqrt(Math.pow(this.x2 - incenterX, 2) + Math.pow(this.y2 - incenterY, 2));
    var distanceToIC3 = Math.sqrt(Math.pow(this.x3 - incenterX, 2) + Math.pow(this.y3 - incenterY, 2));

    var ratio1 = distance1 / distanceToIC1;
    var ratio2 = distance2 / distanceToIC2;
    var ratio3 = distance3 / distanceToIC3;

    if (clampLimit === undefined)
    {
	this.x1 = this.x1 + ((this.x1 - incenterX) * ratio1);
	this.y1 = this.y1 + ((this.y1 - incenterY) * ratio1);

	this.x2 = this.x2 + ((this.x2 - incenterX) * ratio2);
	this.y2 = this.y2 + ((this.y2 - incenterY) * ratio2);

	this.x3 = this.x3 + ((this.x3 - incenterX) * ratio3);
	this.y3 = this.y3 + ((this.y3 - incenterY) * ratio3);
    } else {
	this.x1 = this.x1 + ((this.x1 - incenterX) * ratio1).clamp(-clampLimit, clampLimit);
	this.y1 = this.y1 + ((this.y1 - incenterY) * ratio1).clamp(-clampLimit, clampLimit);

	this.x2 = this.x2 + ((this.x2 - incenterX) * ratio2).clamp(-clampLimit, clampLimit);
	this.y2 = this.y2 + ((this.y2 - incenterY) * ratio2).clamp(-clampLimit, clampLimit);

	this.x3 = this.x3 + ((this.x3 - incenterX) * ratio3).clamp(-clampLimit, clampLimit);
	this.y3 = this.y3 + ((this.y3 - incenterY) * ratio3).clamp(-clampLimit, clampLimit);
    }

};;
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global L */
L.objects.Point2D = function(x,y)
{
    this.x = x;
    this.y = y;
};

L.objects.Point2D.prototype.distanceToPoint = function(otherPoint)
{
  var xd = this.x-otherPoint.x;
  var yd = this.y-otherPoint.y;
  return Math.sqrt(xd*xd+yd*yd);
};

L.objects.Point2D.prototype.closestPoint = function(point1,point2)
{

};;
/*
 * RayCast Window Object
 *
 * Can use generic camera
 *
 * follows standard raytrace algorithms
 * however, stores each column in array beforw drawing, in order to sort z order and display 3d sprites
 * need to learn floor rendering
 *
 * checks if walls are transparent, in order to
 *
 *
 * need to figure out good algorithm for floor
 */

/* global L */
L.objects.Ray2D = function(xOrigin, yOrigin, angle, range)

{
    this.xOrigin = xOrigin;
    this.yOrigin = yOrigin;
    this.range = range;
    this.slopeX = 0;
    this.slopeY = 0;
    this.yIntercept = 0;

    this.setAngle(angle);

    this.currentX = xOrigin;
    this.currentY = yOrigin;

};

L.objects.Ray2D.prototype.setAngle = function(angle)
{
    //y = mx+c

    this.slopeX = Math.cos(-angle);
    this.slopeY = Math.sin(-angle);
    //	this.slope = this.sin / this.cos;
    this.slope = Math.tan(-angle);
    this.yIntercept = this.yOrigin - (this.xOrigin * this.slope);
};

L.objects.Ray2D.prototype.moveOrigin = function(x, y, angle)
{
    this.xOrigin = this.currentX = x;
    this.yOrigin = this.currentY = y;

    this.setAngle(angle);

};

L.objects.Ray2D.prototype.getYFromX = function(x)
{
    return this.slope * x + this.yIntercept;
};

L.objects.Ray2D.prototype.getXFromY = function(y)
{
    return (y - this.yIntercept) / this.slope;
};
L.objects.Ray2D.prototype.inspectPoint = function(x, y, xPositive, yPositive, vertical, map, arrayOfRays, rayNum)
{
    if (x < 0 || y < 0)
    {
	return false;
    }
    var xGrid = x | 0 - (xPositive && !vertical) ? 0 : 1;
    var yGrid = y | 0;
    if (map[yGrid]
    && map[yGrid][xGrid]
    && map[yGrid][xGrid] === 1)
    {
	var xDist = x - this.xOrigin;
	var yDist = y - this.yOrigin;
	var distance = Math.sqrt(xDist * xDist + yDist * yDist);
	if (!arrayOfRays[rayNum] || arrayOfRays[rayNum].distance > distance)
	{
	    arrayOfRays[rayNum] = {
		frame: this.frameCount,
		distance: distance,
		adjustedDistance: distance * Math.cos(this.angle),
		x: x,
		y: y
	    };
	}
    }

};
L.objects.Ray2D.prototype.findNextIntersection = function(map, range, arrayOfRays, rayNum)
{
    this.xPositive = (this.slopeX >= 0) ? true : false;
    this.yPositive = (this.slopeY >= 0) ? true : false;
    this.resolved = false;


    while (!this.resolved)
    {
	if (Math.abs(this.currentX - this.xOrigin) > range || Math.abs(this.currentY - this.yOrigin) > range)
	{
	    this.resolved = true;
	    break;
	}

	if (this.xPositive)
	{
	    if (this.currentX < 0)
	    {
		this.currentX = -1;
	    }
	    this.nextVertX = (this.currentX + 1) | 0;
	} else
	{
	    if (this.currentX < 0)
	    {
		return false;
	    }
	    this.nextVertX = ((this.currentX | 0) === this.currentX) ? this.currentX - 1 : (this.currentX | 0);
	}
	this.nextVertY = this.getYFromX(this.nextVertX);

	if (this.yPositive)
	{
	    if (this.currentY < 0)
	    {
		this.currentY = -1;
	    }
	    this.nextHorY = (this.currentY + 1) | 0;
	} else
	{
	    if (this.currentY < 0)
	    {
		return false;
	    }
	    this.nextHorY = ((this.currentY | 0) === this.currentY) ? this.currentY - 1 : (this.currentY | 0);
	}
	this.nextHorX = this.getXFromY(this.nextHorY);

	this.dVertX = this.xOrigin - this.nextVertX;
	this.dVertY = this.yOrigin - this.nextVertY;
	this.dHorX = this.xOrigin - this.nextHorX;
	this.dHorY = this.yOrigin - this.nextHorY;

	if (this.dHorX * this.dHorX + this.dHorY * this.dHorY >= this.dVertX * this.dVertX + this.dVertY * this.dVertY)

	{
	    this.currentX = this.nextVertX;
	    this.currentY = this.nextVertY;
	    this.vertical = true;
	} else
	{
	    this.currentX = this.nextHorX;
	    this.currentY = this.nextHorY;
	    this.vertical = false;
	}




	if (this.currentY < 0 || this.currentX < 0)
	{
	    //this.resolved=true;
	    continue;
	}

	this.gridX = (!this.xPositive && this.vertical) ? (this.currentX - 1) | 0 : this.currentX | 0;
	this.gridY = (!this.yPositive && !this.vertical) ? (this.currentY - 1) | 0 : this.currentY | 0;

	if (map.grid[this.gridY]
	&& map.grid[this.gridY][this.gridX]
	&& map.grid[this.gridY][this.gridX] !== 0)
	{
	    this.resolved = true;
	    return true;
	}


    }
    return false;
};




L.objects.RayCastWindow = function(useBufferedCanvas)
{
    this.buffer = false;
    this.bufferContext = false;
    if (useBufferedCanvas)
    {
	this.buffer = document.createElement('canvas');
	this.bufferContext = this.buffer.getContext('2d');
    }
    this.x = 0;
    this.y = 0;
    this.width = 600;
    this.height = 300;

    this.relativeAngles = [];


    this.resolutionRatio = 1;
    this.range = 10;
    this.viewAngle = Math.PI / 1.5;
    this.camera = new L.objects.Camera();
    this.setHorizontalResolution(600);
    this.arrayOfRays = [];

    this.rayObject = new L.objects.Ray2D(0, 0, 0);

    this.map = {};
    this.map.type = "simple";
    this.map.legend = {1:"#ffffff"};
    this.map.grid =[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
	[1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
	[1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];


    //debugging vars
    this.camera.x = 3.5;
    this.camera.y = 4.5;
    this.camera.angle = 0;
    this.frameCount = 0;

};

L.objects.RayCastWindow.prototype.setResolution = function(xRes, yRes)
{
    this.setHorizontalResolution(xRes);
    if (this.buffer)
    {
	this.buffer.width = xRes;
    }
};

L.objects.RayCastWindow.prototype.setHorizontalResolution = function(horizontalResolution)
{
    this.horizontalResolution = horizontalResolution;
    var leftAngle = this.viewAngle / 2;
    //tan angle = opp/hyp
    var maxDistance = -Math.tan(leftAngle) / 2;
    alert(maxDistance);
    for (var i = 0; i < horizontalResolution; i++)
    {
	var currentAngle = Math.atan2(-maxDistance * 2 * i / horizontalResolution + maxDistance, 1);
	this.relativeAngles.push(currentAngle);
    }
};

L.objects.RayCastWindow.prototype.update = function(dt)
{



    this.frameCount += 1;
    var centreAngle = this.camera.angle;
    var x = this.camera.x;
    var y = this.camera.y;
    var columns = this.horizontalResolution;
    //this.camera.angle += .2 * dt;

    for (var i = 0; i < columns; i++)
    {
	var relativeAngle = this.relativeAngles[i];
	var angle = centreAngle - relativeAngle;
	this.rayObject.moveOrigin(x, y, angle);


	if (this.rayObject.findNextIntersection(this.map, 20, this.arrayOfRays, i))
	{
	    var xDist = x - this.rayObject.currentX;
	    var yDist = y - this.rayObject.currentY;
	    var distance = Math.sqrt(xDist * xDist + yDist * yDist);
	    this.arrayOfRays[i] = {
		frame: this.frameCount,
		distance: distance,
		adjustedDistance: distance * Math.cos(relativeAngle),
		x: this.rayObject.currentX,
		y: this.rayObject.currentY
	    };
	} else
	{
	    this.arrayOfRays[i] = 0;

	}



	/**
	 for (var xCheck = startX; xCheck < endX; (directionX > 0)?xCheck++:xCheck--)
	 {
	 /** if (x > xCheck)
	 {
	 continue;
	 }

	 var currentY = slope * xCheck + yIntersect;
	 if (currentY - y > this.range || this.map[Math.floor(currentY)] === undefined)
	 {
	 break;
	 }

	 var blockVal = this.map[Math.floor(currentY)][xCheck];
	 if (blockVal === 1)
	 {
	 //alert(2);
	 var yDist = currentY - y;
	 if (yDist <= 0 !== directionY <= 0)
	 {
	 continue;
	 }
	 var xDist = xCheck - x;
	 if (xDist <= 0 !== directionX <= 0)
	 {
	 continue;
	 }
	 var distance = Math.sqrt(xDist * xDist + yDist * yDist);
	 this.arrayOfRays[i] = {
	 frame: this.frameCount,
	 distance: distance,
	 adjustedDistance: distance * Math.cos(relativeAngle)
	 };

	 break;

	 }
	 )
	 **/

    }
};
L.objects.RayCastWindow.prototype.drawDebugMap = function(ctx, xPos, yPos, widht, height, scale)
{
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(xPos, yPos, this.map.grid[0].length * scale, this.map.grid.length * scale);
    for (var yCoords = 0; yCoords < this.map.grid.length; yCoords++)
	for (var xCoords = 0; xCoords < this.map.grid[0].length; xCoords++)
	{
	    if (this.map.grid[yCoords][xCoords] === 1)
	    {
		ctx.fillStyle = "#000000";
		ctx.fillRect(xCoords * scale, yCoords * scale, scale, scale);
	    }
	}

    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(this.camera.x * scale, this.camera.y * scale, 2.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    var arrayLength = this.arrayOfRays.length;
    ctx.strokeStyle = "#00FF00";
    for (var i = 0; i < arrayLength; i++)

    {
	if (this.arrayOfRays[i] !== undefined && this.arrayOfRays[i].frame === this.frameCount)
	{
	    var currentRay = this.arrayOfRays[i];
	    var currentAngle = this.camera.angle - this.relativeAngles[i];
	    var distance = currentRay.distance;
	    ctx.beginPath();
	    ctx.moveTo(this.camera.x * scale, this.camera.y * scale);
	    ctx.lineTo(currentRay.x * scale, currentRay.y * scale);
	    ctx.closePath();
	    ctx.stroke();

	}
    }
};
L.objects.RayCastWindow.prototype.draw = function(ctx)
{
    ctx.fillStyle = "#003366";
    ctx.fillRect(0, 0, this.width, this.height / 2);
    var arrayLength = this.arrayOfRays.length;
    var lineWidth = this.width / this.horizontalResolution;
    var currentRay;
    for (var i = 0; i < arrayLength; i++)

    {
	if (this.arrayOfRays[i] !== undefined && this.arrayOfRays[i].frame === this.frameCount)
	{
	    var currentRay = this.arrayOfRays[i];
	    var distance = currentRay.distance;
	    var height = this.height / 2 * 1 / currentRay.adjustedDistance;
	    var light = ((1 / (distance + 1) * 2) * 255) | 0;
	    var fillColor = "rgb(" + light + "," + light + "," + light + ")";
	    ctx.fillStyle = fillColor;
	    ctx.fillRect(i * lineWidth, 150 - (height / 2), lineWidth, height);
	}
    }
    this.drawDebugMap(ctx, 0, 0, 0, 0, 10);
    /**
     ctx.fillStyle = "#ffffff";
     ctx.fillRect(0, 0, this.map[0].length * 10, this.map.length * 10);
     for (var yCoords = 0; yCoords < this.map.length; yCoords++)
     for (var xCoords = 0; xCoords < this.map[0].length; xCoords++)
     {
     if (this.map[yCoords][xCoords] === 1)
     {
     ctx.fillStyle = "#000000";
     ctx.fillRect(xCoords * 10, yCoords * 10, 10, 10);
     }
     }

     ctx.fillStyle = "#FF0000";
     ctx.beginPath();
     ctx.arc(this.camera.x * 10, this.camera.y * 10, 2.5, 0, 2 * Math.PI);
     ctx.fill();
     ctx.closePath();

     ctx.strokeStyle = "#00FF00";
     for (var i = 0; i < arrayLength; i++)

     {
     if (this.arrayOfRays[i] !== undefined && this.arrayOfRays[i].frame === this.frameCount)
     {
     var currentRay = this.arrayOfRays[i];
     var currentAngle = this.camera.angle - this.relativeAngles[i];
     var distance = currentRay.distance;
     ctx.beginPath();
     ctx.moveTo(this.camera.x * 10, this.camera.y * 10);
     ctx.lineTo(currentRay.x * 10, currentRay.y * 10);
     ctx.closePath();
     ctx.stroke();

     }
     }**/

};

;
/* global L */

/**
 * Creates a new Rectangle
 * @constructor
 * @param {object.<string, number|string|array|object>} [options]
 * @returns {L.objects.Rectangle}
 */
L.objects.Rectangle = function(width, height, options)
{

    /*
     * Animations properties are placeholders for future implementation of
     * frame-based animation
     */



    /*
     this.texture = L.texture[textureName];

     if (this.texture && this.texture.width > 0)
     {
     this.width = this.texture.width;
     this.height = this.texture.height;
     L.log("Setting Rectangle dimensions to " + this.width + " by " + this.height + ".");
     }
     */

    this.width = width;
    this.height = height;

    this.fillstyle = "";
    this.lineWidth = 2;
    this.strokeStyle = "";

    this.handle = {
	x: 0,
	y: 0
    };
    this.offset = {
	x: 0,
	y: 0
    };
    this.scale = {
	x: 1,
	y: 1
    };
    for (var propertyName in options)
    {
	if (options.hasOwnProperty(propertyName)) {
	    L.log("Adding property " + propertyName + " to Rectangle object with with value " + JSON.stringify(options[propertyName]) + ".");
	    this[propertyName] = options[propertyName];
	}
    }

    Object.defineProperty(this, "center", {
	get: function() {
	    return {
		x: this.width / 2,
		y: this.height / 2
	    };
	}.bind(this)
    });





    this.nudeTop = 0;
    this.nudeLeft = 0;
    this.nudeRight = this.nudeLeft + this.width;
    this.nudeBottom = this.nudeTop + this.height;
    this.nudeTopLeft = [this.nudeLeft, this.nudeTop];
    this.nudeTopRight = [this.nudeRight, this.nudeTop];
    this.nudeBottomLeft = [this.nudeLeft, this.nudeBottom];
    this.nudeBottomRight = [this.nudeRight, this.nudeBottom];
    this.nudeVertices = [this.nudeTopLeft, this.nudeTopRight, this.nudeBottomRight, this.nudeBottomLeft];
    this.vertices = new Array(this.nudeVertices.length);

    this.rotationAccel = 0;

    this.accelDirection = 0;
    this.nextX = this.x;
    this.nextY = this.y;
    this.nextSpeedX = this.speedX;
    this.nextSpeedY = this.speedY;
    this.wrapX = true;
    this.wrapY = false;
    this.boundingType = "rect";


    this.blendMode = "";
    this.onClick = function() {

    };
    this.currentAnimation = "idle";
    this.currentFrame = 0;
    this.animationTimer;
    this.updateCommands = {};
    this.drawCommands = {};

//Predictive physics experimentation
    this.gravity = 0;
    this.g = 1000;
    this.direction = -Math.PI / 2;
    this.v = 0;
    this.y0 = 500 - this.y;
    this.energy = this.y0;
    this.time = 0;
    this.bounces = 0;
    this.landingTime = (this.v * Math.sin(this.direction) + Math.sqrt(Math.pow((this.v * Math.sin(this.direction)), 2) + (2 * this.g * this.y0))) / this.g;

    return this;


};

//Rectangle Instance Properties

L.objects.Rectangle.prototype.x = 0;
L.objects.Rectangle.prototype.y = 0;
L.objects.Rectangle.prototype.z = 0;
L.objects.Rectangle.prototype.width = 0;
L.objects.Rectangle.prototype.height = 0;

//L.objects.Rectangle.prototype.scale = 1;
L.objects.Rectangle.prototype.angle = 0;
L.objects.Rectangle.prototype.rotation = 0;
L.objects.Rectangle.prototype.alpha = 1;
L.objects.Rectangle.prototype.speedX = 0;
L.objects.Rectangle.prototype.speedY = 0;
L.objects.Rectangle.prototype.accelX = 0;
L.objects.Rectangle.prototype.accelY = 0;
L.objects.Rectangle.prototype.visible = true;
L.objects.Rectangle.prototype.isClickable = true;


//Rectangle Instance Methods

/**
 * Sets the sprite's handle coordinates to x and y
 * @method
 * @param {number} x
 * @param {number} y
 * @returns {L.objects.Rectangle}
 */
L.objects.Rectangle.prototype.setHandle = function(x, y)
{
    this.handle = {
	x: x,
	y: y
    };
    return this;
};

//Fix name in personal code
L.objects.Rectangle.prototype.setHandleXY = L.objects.Rectangle.prototype.setHandle;

/**
 * Sets the sprite's proportinal scaling value. Currently only
 * accepts on value
 * @method
 * @param {number} scale
 * @returns {L.objects.Rectangle}
 */
L.objects.Rectangle.prototype.setScale = function(scale)
{
    this.scale = {
	x: scale,
	y: scale
    };
    return this;
};

/**
 *
 * Multiplies the sprite's scale by a scalar
 * @method
 * @param {number} scalar
 * @returns {L.objects.Rectangle}
 */
L.objects.Rectangle.prototype.multiplyScale = function(scalar)
{
    this.scale = {
	x: scalar * this.scale.x,
	y: scalar * this.scale.y
    };
    return this;
};

L.objects.Rectangle.prototype.flipHorizontal = function()
{
    this.scale.x *= -1;
    return this;
};
L.objects.Rectangle.prototype.flipVertical = function()
{
    this.scale.y *= -1;
    return this;
};
L.objects.Rectangle.prototype.getX = function()
{
    return this.x + this.offset.x;
};
L.objects.Rectangle.prototype.getY = function()
{
    return this.y + this.offset.y;
};
L.objects.Rectangle.prototype.getScreenX = function()
{
    var currentScene = L.system.currentScene;
    return this.x + this.offset.x - (currentScene.camera.x * currentScene.activeLayer.scrollRateX);
};
L.objects.Rectangle.prototype.getScreenY = function()
{
    var currentScene = L.system.currentScene;
    return this.y + this.offset.y - (currentScene.camera.y * currentScene.activeLayer.scrollRateY);
};

L.objects.Rectangle.prototype.autoDraw = function(layer)
{
    if (!this.visible || (this.alpha) <= 0.0) {
	return;
    }
    var angle = this.angle;
    var screenX = this.getScreenX();
    var screenY = this.getScreenY();
    var scale = this.scale;
    // var texture = this.texture;
    layer.globalAlpha = this.alpha;

    if (true)
    {
	layer.save();
	layer.translate(screenX, screenY);
	layer.scale(scale.x, scale.y);
	layer.rotate(-angle);
	layer.beginPath();

	layer.rect(-this.handle.x, -this.handle.y, this.width, this.height);
	if (this.fillStyle !== "")
	{
	    if (this.fillStyle !== layer.fillStyle)
	    {
		layer.fillStyle = this.fillStyle;
	    }
	    layer.fill();
	}
	if (this.lineWidth !== 0 && this.strokeStyle !== "")
	{
	    if (this.lineWidth !== layer.lineWidth)
	    {
		layer.lineWidth = this.lineWidth;
	    }
	    if (this.strokeStyle !== layer.strokeStyle)
	    {
		layer.strokeStyle = this.strokeStyle;
	    }
	    layer.stroke();
	}
	layer.restore();
    } else {
	// layer.scale(1/this.scale,1/this.scale);
	layer.drawImage(this.animations[this.currentAnimation][this.currentFrame].img, this.x - this.handle.x, this.y - this.handle.y);
	//layer.scale(this.scale,this.scale);
    }
    return this;
};
L.objects.Rectangle.prototype.draw = L.objects.Rectangle.prototype.autoDraw;

L.objects.Rectangle.prototype.autoDrawCustom = function(layer, options) // do not use
{
    layer.globalAlpha = (options && options.opacity !== undefined) ? options.opacity : this.alpha;
    if (this.alpha > 0.0 && this.visible)
    {
	if (this.angle !== 0)
	{
	    layer.save();
	    layer.translate(this.x, this.y);
	    layer.rotate(-this.angle);

	    layer.drawImage((options && options.texture !== undefined) ? options.texture : this.animations.idle[this.currentFrame].img, -this.handle.x, -this.handle.y);
	    layer.restore();
	} else {

	    layer.drawImage((options && options.texture !== undefined) ? options.texture : this.animations.idle[this.currentFrame].img, this.x - this.handle.x, this.y - this.handle.y);

	}
    }
};
L.objects.Rectangle.prototype.drawBoundingBox = function(layer, strokeStyle, lineWidth)
{
    layer.beginPath();
    this.getVertices();
    layer.moveTo(this.vertices[3][0], this.vertices[3][1]);
    for (var i = 0; i < 4; i++)
    {
	layer.lineTo(this.vertices[i][0], this.vertices[i][1]);
    }
    layer.closePath();
    layer.strokeStyle = strokeStyle || "#FFFFFF";
    layer.lineWidth = lineWidth || 2;
    layer.stroke();
    return this;
};

L.objects.Rectangle.prototype.autoUpdate = function(dt)
{
    var timeScale = L.system.timeScale;
    this.speedX += this.accelX * dt * timeScale;
    this.speedY += this.accelY * dt * timeScale;
    this.x += this.speedX * dt * timeScale;
    this.y += this.speedY * dt * timeScale;
    this.rotation += this.rotationAccel * dt * timeScale;
    this.angle += this.rotation * dt * timeScale;
};

L.objects.Rectangle.prototype.handleClick = function(mouseX, mouseY, e)
{
    if (this.isClickable)
    {
	var scale = this.scale;
	var screenX = this.getScreenX();
	var screenY = this.getScreenY();
	if (this.angle === 0)
	{
	    var left = screenX - (scale.x * this.handle.x);
	    var right = left + (scale.x * this.width);
	    var top = screenY - (scale.y * this.handle.y);
	    var bottom = top + (scale.y * this.height);

	    if (left > right)
	    {
		var temp = left;
		left = right;
		right = temp;
	    }

	    if (top > bottom)
	    {
		var temp = top;
		top = bottom;
		bottom = temp;
	    }

	    if (
	    mouseX >= left &&
	    mouseX <= right &&
	    mouseY >= top &&
	    mouseY <= bottom
	    )
	    {
		if (this.isClickedPrecise(mouseX, mouseY))
		{
		    if (e.type === "mousedown" || e.type === "touchstart")
		    {
			this.onClick(mouseX, mouseY, e);

			return true;
		    }
		}
	    }
	} else if (
	this.angle !== 0 &&
	Math.jordanCurve(mouseX, mouseY, this.getVertices()))
	{

	    if (this.isClickedPrecise(mouseX, mouseY))
	    {

		if (e.type === "mousedown" || e.type === "touchstart")
		{
		    this.onClick(mouseX, mouseY, e);

		    return true;
		}
	    }
	}
    }
};

/**
 * Checks if non-empty sprite pixels exist at specific screen coordinates
 * @method
 * @param {number} mouseX
 * @param {number} mouseY
 * @returns {Boolean}
 */
L.objects.Rectangle.prototype.isClickedPrecise = function(mouseX, mouseY)
{

    var layer = L.system.pixelContext[0];
    layer.clearRect(-1, -1, 3, 3);
    layer.save();
    layer.translate(-mouseX, -mouseY);
    this.autoDraw(layer);
    layer.restore();
    var pixelData = layer.getImageData(0, 0, 1, 1).data;
    return (pixelData[3] !== 0);
};


L.objects.Rectangle.prototype.getSpeedX = function()
{
    return Math.vectorX(this.speed, this.direction);
};

L.objects.Rectangle.prototype.getSpeedY = function()
{
    return Math.vectorY(this.speed, this.direction);
};

L.objects.Rectangle.prototype.applyForce = function(speed, direction)
{
    var x1 = this.getSpeedX();
    var y1 = this.getSpeedY();
// var d1 = this.direction;

    var x2 = Math.vectorX(speed, direction); // * L.system.dt* L.system.timeScale;
    var y2 = Math.vectorY(speed, direction); // * L.system.dt * L.system.timeScale;
//var d2 = direction;


    var adj = x1 + x2;
    var opp = y1 + y2;
    var length = Math.pow((Math.pow(adj, 2) + Math.pow(opp, 2)), 1 / 2);
    var angle = Math.radToDeg(Math.atan2(-opp, adj));
//alert(length);
    this.direction = angle;
    this.speed = length;
};

L.objects.Rectangle.prototype.moveTo = function(coords)
{
    this.x = coords.x;
    this.y = coords.y;
};
L.objects.Rectangle.prototype.moveToX = function(x)
{
    this.x = x;
};
L.objects.Rectangle.prototype.move = function(coords)
{
    this.x += coords.x;
    this.y += coords.y;
};
L.objects.Rectangle.prototype.moveX = function(x)
{
    this.move({
	x: x,
	y: 0
    });
};
L.objects.Rectangle.prototype.moveY = function(y)
{
    this.move({
	x: 0,
	y: y
    });
};

L.objects.Rectangle.prototype.centerHandle = function()
{
    this.handle = {
	x: this.center.x,
	y: this.center.y
    };
};

L.objects.Rectangle.prototype.pushProperties = function(obj, propertiesArray)
{
    var arrayLength = propertiesArray.length;
    for (var i = 0; i < arrayLength; i++)
    {
	obj[propertiesArray[i]] = this[propertiesArray[i]];
    }
};

L.objects.Rectangle.prototype.pushPosition = function(obj)
{
    obj.x = this.x;
    obj.y = this.y;
    obj.offset = {
	x: this.offset.x,
	y: this.offset.y
    };
};

/*
 * Needs rewrite:
 * Was trying to keep method from creating too many new objects,
 * but it would be much cleaner to just have this method
 * return an array of points, so that the method can be near
 * identical on all polygonal objects
 */
L.objects.Rectangle.prototype.getVertices = function()
{
    var Math = window.Math;
    var xTransform = this.getScreenX() + this.offset.x;
    var yTransform = this.getScreenY() + this.offset.y;
    var length = this.nudeVertices.length;
    var angle = this.angle;
    var scale = this.scale;
    if (angle !== 0)
    {
	for (var i = 0; i < length; i++)
	{
	    this.vertices[i] = [
		(this.nudeVertices[i][0] - this.handle.x) * Math.cos(-angle) - (this.nudeVertices[i][1] - this.handle.y) * Math.sin(-angle),
		(this.nudeVertices[i][0] - this.handle.x) * Math.sin(-angle) + (this.nudeVertices[i][1] - this.handle.y) * Math.cos(-angle)
	    ];
	}
    } else
    {
	for (var i = 0; i < length; i++)
	{
	    this.vertices[i] = [this.nudeVertices[i][0] - this.handle.x, this.nudeVertices[i][1] - this.handle.y];
	}
    }

    this.vertices.mapQuick(function(entry) {
	entry[0] = (entry[0] * scale.x) + xTransform;
	entry[1] = (entry[1] * scale.y) + yTransform;
    });
    return this.vertices;
};
L.Frame = function(textureName, length)
{
    this.img = L.texture[textureName];
    this.length = length;
};
L.Animation = function(frames)
{

};

L.objects.Rectangle.prototype.experimentalUpdate = function(dt)
{
//alert(this.landingTime);
    var L = L;
    this.time += dt * L.system.timeScale;
    var Math = Math;
    if (this.time >= this.landingTime)
    {

	if (this.energy < 1)
	{
	    this.energy = 0;
	}
//this.energy *= 1.01;
	this.direction = Math.PI / 2;
	this.y0 = 0;
	this.v = Math.sqrt((this.g * 2 * this.energy) / (Math.pow(Math.sin(this.direction), 2)));
	this.time -= this.landingTime;
	this.landingTime = (this.v * Math.sin(this.direction) + Math.sqrt(Math.pow((this.v * Math.sin(this.direction)), 2) + (2 * this.g * this.y0))) / this.g;
    }


    if (this.landingTime < dt * L.system.timeScale)
    {
	this.y = 500;
    } else {
	this.y = 500 - this.y0 - (this.v * Math.sin(this.direction) * this.time - (this.g * this.time * this.time / 2));
    }
    if (this.y >= 500) {
	this.y = 500;
    }

    this.nextY = this.y;
    this.nextSpeedX += this.accelX * dt * L.system.timeScale;
//  this.nextSpeedY += this.accelY * dt * L.system.timeScale;

    this.nextX += this.nextSpeedX * L.system.dt * L.system.timeScale;
//   this.nextY += this.nextSpeedY * L.system.dt * L.system.timeScale;


    if (this.nextX >= 800)
    {
	this.nextSpeedX = -this.speedX;
	this.speedX = -this.speedX;
	this.nextX = 799;
    }
    if (this.nextX <= 49)
    {
	this.nextSpeedX = -this.speedX;
	this.speedX = -this.speedX;
	this.nextX = 50;
    }
//    this.y = (this.nextY);
    this.x = (this.nextX);
//   this.speedY = (this.nextSpeedY);
    this.speedX = (this.nextSpeedX);
//  }

//  this.x += 1;
// this.y += 1;


};;globalScope[nameSpace] = L;})(window,'L');