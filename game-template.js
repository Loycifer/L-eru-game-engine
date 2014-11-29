var L;    //Do not remove this line or overwrite global variable L


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
