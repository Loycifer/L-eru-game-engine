var L;    //Do not remove this line or overwrite variable L
function L_Game()
{

    //This is where you should Declare Variables
    //Since JavaScript is loosely typed, you may want to set variables with empty types
    //eg. var score = 0; var flags = []; var name = "";


    //Scenes
    //eg. var mainScene, secondScene;

    //Constants and Variables
    //eg. var WIDTH = 640;

    //Objects and Arrays
    

    //Input Handling
    //eg. window.addEventListener("keydown", yourKeydownFunction, true);



    this.settings = function() {


	//This is where to adjust engine settings
	//eg. L.system.width = WIDTH;
	//    L.system.height = (L.system.Width/16) * 9;
	//    L.system.useDoubleBuffer = true;


    };


    this.resources = function() {
	//This is where you load resources such as textures and audio
	//Textures are stored in L.texture[x], where x is the texture's name
	//Souns and music are similarly stored in L.sound[x] and
	//L.music[x]

	//eg. L.loadTexture.fromFile("littleDude", "little-dude.png");

    };


    this.initialise = function() {
	//This is where to build game logic such as scenes, sprites,
	//behaviours, and input handling
	//Scenes are stores in L.scene[x], where x is the name of the scene

	//eg. mainScene = new L.objects.Scene("mainScene");
	//    mainScene.addLayer();
	//    mainScene.layers[0].addObject(someExistingObject);
	//    L.system.currentScene = mainScene;

    };


    this.update = function(dt)
    {
	//This function can be left alone; it invokes every active object's update() automatically
	L.system.currentScene.update(dt);
	
    };


    this.draw = function()
    {
	//This function can be left alone; it invokes every active object's draw() automatically
	L.system.currentScene.draw();

    };
}
