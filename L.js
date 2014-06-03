/*
 * L ('ɛrɥ) Game Engine Core
 */

var L = {};

/*
 * Core Structuring
 */

L.system = {};
L.objects = {};




L.start = function() {

    window.removeEventListener('load', L.start);
    var game = new L_Game();

    game.settings();
    L.system.setup();
    game.resources();
    game.initialise();

    (function gameLoop() {
	L.system.now = window.performance.now();
	L.system.dt = (L.system.now - L.system.then) / 1000;
	if (L.system.dt > 1 / L.system.frameCap)
	{
	    L.system.dt = 1 / L.system.frameCap;
	}
	L.system.then = L.system.now;

	game.update(L.system.dt);

	requestAnimationFrame(gameLoop);
	game.draw();
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
L.system.mouseX = 0;
L.system.mouseY = 0;
L.system.now, L.system.then = window.performance.now();
L.system.dt = 0;



L.system.resourcePath = "resources/";		    // Holds path to resource folder
L.system.soundPath = "sounds/";			    // Holds path to sound files
L.system.texturePath = "textures/";		    // Holds path to image files
L.system.expectedResources = 0;
L.system.loadedResources = 0;


L.system.width = 640;
L.system.height = 480;
L.system.canvasLocation = document.body;






L.system.layerAlpha = 1;
L.system.currentScene = {};
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
    };

    thisTexture.onerror = function() {
	L.alert("Something went wrong loading texture file " + file + ".");
    };

    thisTexture.src = L.system.resourcePath + L.system.texturePath + file;

    L.texture[name] = thisTexture;
    return thisTexture;
};



L.sound = {};
L.music = {};

//window.onload = L.start;
window.addEventListener('load', L.start);



L.system.renderCanvas = [];
L.system.renderContext = [];
L.system.bufferCanvas = [];
L.system.bufferContext = [];
L.system.fxCanvas = [];
L.system.fxContext = [];
L.system.pixelCanvas = [];
L.system.pixelContext = [];