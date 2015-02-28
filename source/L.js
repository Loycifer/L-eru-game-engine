/*
 * L ('ɛrɥ) Game Engine Core
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
    //L.globals = new game.globals();
    //game.globals = null;

    game.settings();
    system.setup();
    game.resources();
    system.setLoadScreen();
/*
    if (L.system.loadScreen === undefined)
    {
	L.system.loadScreen = new L.objects.Scene();
	L.system.loadScreen.bgFill = "#000000";
	var text = new L.objects.Textbox("loading", L.system.width / 2, L.system.height / 2 - 30);
	text.alignment = "center";
	text.backgroundFill = "";
	text.textFill = "#FFFFFF";
	text.autoSize();
	L.system.loadScreen.layers["background"].addObject(
	text
	);
    }
    L.system.loadScreen.setScene();
   // while (L.system.expectedResources > L.system.loadedResources)
L.system.loadScreen.update = function(dt)
{
   if (L.system.expectedResources === L.system.loadedResources)
   {
       game.main();
   }
};
*/



   // game.main();

    (function gameLoop() {
	var system = L.system;
	var thisScene = system.currentScene;
	//var game = L.game;

	var now = system.now = window.performance.now();
	var dt = system.dt = (system.now - system.then) / 1000;
	if (dt > 1 / system.frameCap)
	{
	    system.dt = 1 / system.frameCap;
	}
	system.then = now;
	//game.update(system.dt);
	thisScene.update(dt);
	thisScene.draw();
	requestAnimationFrame(gameLoop);
	//game.draw();






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
//L.system.mouseX = 0;
//L.system.mouseY = 0;
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