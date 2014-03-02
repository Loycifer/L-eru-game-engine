


// L ('ɛrɥ)
var L = {};


L.start = function() {

window.removeEventListener('load', L.start);
    var game = new L_Game();

    game.settings();
    L.system.setup();
    //TODO stuff
    game.resources();
    game.initialise();

    (function gameLoop() {
	L.system.now = window.performance.now();
	L.system.dt = (L.system.now - L.system.then) / 1000;
	if (L.system.dt > 1 / 45)
	{
	    L.system.dt = 1 / 45;
	}
	L.system.then = L.system.now;
	game.update();
	game.draw();
	requestAnimationFrame(gameLoop);
	
	
    })();

};



/***********************************************************************
 * Initialization
 * 
 */

L.whisper = function(message)
{
    console.log(message);
};

L.shout = function(message)
{
    window.alert(message);
};

L.system = {};
L.system.timeScale = 1;
L.system.frameCap = 30;
L.system.now, L.system.then = window.performance.now();
L.system.dt = 0;
L.system.checkAudio = function() // Checks for client-supported audio type
{
    var dummyAudio = document.createElement('audio');
    if (dummyAudio.canPlayType('audio/wav'))
    {
	L.system.audioType = ".wav";
	L.whisper("Using .wav files");
    }
    else if (dummyAudio.canPlayType('audio/mp4'))
    {
	L.system.audioType = ".m4a";
	L.whisper("Using .m4a files");
    }
    else
    {
	L.shout("Your browser doesn't support .wav or .m4a files.");
    }

};

(function() {
    L.system.checkAudio();
})();  //Autoruns checkAudio

L.system.resourcePath = "resources/";		    // Holds path to resource folder
L.system.soundPath = "sounds/";			    // Holds path to sound files
L.system.texturePath = "textures/";		    // Holds path to image files
L.system.expectedResources = 0;
L.system.loadedResources = 0;


L.system.width = 640;
L.system.height = 480;






L.system.layerAlpha = 1;
L.system.currentScene = {};
L.scenes = {};
/**********************************************************************
 *  Resources
 * 
 */

L.texture = {};
L.loadTexture = {};
L.loadTexture.fromFile = function(name, file)
{

    var thisTexture = new Image();
    thisTexture.onload = function() {
    };
    thisTexture.onerror = function(e) {
    };

    thisTexture.src = L.system.resourcePath + L.system.texturePath + file;

    L.texture[name] = thisTexture;
    //alert("hi");
};



L.sound = {};
L.music = {};







/*TODO
 * Texture2D
 * Sprites
 * Audio
 * Bone Movement
 * Control Mapper
 * Clickables
 * Stage
 * Layers
 * Textbox
 * Rotation
 * 
 * 
 * 
 * 
 */


//window.onload = L.start;
window.addEventListener('load', L.start);




window.onunload=function(){L = null;};

/*
var arraytest = [1,2,3,4,5,6,7,8,9,0,[1,2,3,4,5,6,7,8,9,0]];
var targetarray = [];
var starttime = window.performance.now();
for (var i = 0; i < 1000; i++)
{
    targetarray = arraytest.copy();
}
var time1 = window.performance.now() - starttime;

var starttime = window.performance.now();
for (var i = 0; i < 1000; i++)
{
    targetarray = arraytest.copy2();
}
var time2 = window.performance.now() - starttime;

alert(time1+","+time2);
*/