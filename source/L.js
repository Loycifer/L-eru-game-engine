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



L.start = function() {

    //window.removeEventListener('load', L.start);
    var game = L.game;
    var system = L.system;

    game.settings();
    system.setup();
    game.resources();
    system.setLoadScreen();

    (function gameLoop() {
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
	    system.dt = 1 / system.frameCap;
	}
	system.then = now;
	thisScene.update(dt*((L.system.isPaused)?0:1));
	thisScene.draw();
	requestAnimationFrame(gameLoop);

	//thisScene.draw();
    })();
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
	thisTexture.error = undefined;
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




L.sound = {};
L.music = {};

window.addEventListener('load', L.start);



L.system.renderCanvas = [];
L.system.renderContext = [];
L.system.bufferCanvas = [];
L.system.bufferContext = [];
L.system.fxCanvas = [];
L.system.fxContext = [];
L.system.pixelCanvas = [];
L.system.pixelContext = [];