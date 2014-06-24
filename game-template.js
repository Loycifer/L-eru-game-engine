var L;    //Do not remove this line or overwrite variable L

L.game.globals = function() {
//This is where you should Declare Variables
//Since JavaScript is loosely typed, you may want to set variables with empty types
//eg. this.score = 0; this.flags = []; this.name = "";


//Scenes
//eg. this.mainScene, secondScene;

//Constants and Variables
//eg. this.WIDTH = 640;

//Objects and Arrays




};

L.game.settings = function() {


    //This is where to adjust engine settings
    L.system.width = 900;
    L.system.height = 600;
    //L.system.canvasLocation = document.getElementById("YOURDIV");
    L.system.fullscreen = true;
    L.system.orientation = "landscape";


};


L.game.resources = function() {
    //This is where you load resources such as textures and audio
    //Textures are stored in L.texture[x], where x is the texture's name
    //Souns and music are similarly stored in L.sound[x] and
    //L.music[x]

    //eg. L.loadTexture.fromFile("littleDude", "little-dude.png");

};


L.game.initialise = function() {
    //This is where to build game logic such as scenes, sprites,
    //behaviours, and input handling
    //Scenes are stores in L.scene[x], where x is the name of the scene

    //eg. mainScene = new L.objects.Scene("mainScene");
    //    mainScene.addLayer();
    //    mainScene.layers[0].addObject(someExistingObject);
    //    L.system.currentScene = mainScene;

};


L.game.update = function(dt)
{
    //This function can be left alone; it invokes every active object's update() automatically
    L.system.currentScene.update(dt);

};


L.game.draw = function()
{
    //This function can be left alone; it invokes every active object's draw() automatically
    L.system.currentScene.draw();

};

