/**
 *
 * The .settings, .resources, and .main functions can be placed in seperate files if desired. Make sure to prepend each file with a declaration for variable L, like so : var L;
 */




var L;    //Do not remove this line or overwrite global variable L


L.game.settings = function() {


    //This is where you may adjust initial settings

    //Set the internal resolution of your game (width, height)
    L.system.setResolution(640, 400);
    //Set the desired DOM location of the game's canvas
    L.system.setCanvasLocation(document.body);
    //Set whether the canvas should resize to fullscreen
    L.system.setFullscreen(true);
    //Set the screen orientation of the game on handheld devices
    L.system.setOrientation("landscape");
    //Set whether the game should pause when switching to other tabs or windows
    L.system.setAutoPause(true);


};


L.game.resources = function() {
    //This is where you load resources such as textures and audio
    //Textures are stored in L.texture[x], where x is the texture's name
    //Sounds and music are similarly stored in L.sound[x] and
    //L.music[x]

    //eg. L.load.texture("littleDude.png", "little-dude");

};


L.game.main = function() {
    //This is where to build game logic such as scenes, sprites,
    //behaviours, and input handling
    //Scenes are stores in L.scene[x], where x is the name of the scene

    //eg. mainScene = new L.objects.Scene("mainScene");
    //    mainScene.addLayer("background");
    //    mainScene.layers["background"].addObject(someExistingObject);
    //    mainScene.setScene();

};
