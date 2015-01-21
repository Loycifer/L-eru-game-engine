var L;




L.system.setup = function()
{
    var width = L.system.width;
    var height = L.system.height;
    var aspectRatio = L.system.aspectRatio = width / height;

    try {
	screen.lockOrientation(L.system.orientation);
    }
    catch (e)
    {
	L.log("Warning: Screen orientation could not be locked.");
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



    window.addEventListener("keydown", doKeyDown, true);
    function doKeyDown(event) {
	if (L.system.currentScene.doKeyDown !== undefined)
	{
	    L.system.currentScene.doKeyDown(event);
	}
    }

    window.addEventListener("keyup", doKeyUp, true);
    function doKeyUp(event) {
	if (L.system.currentScene.doKeyUp !== undefined)
	{
	    L.system.currentScene.doKeyUp(event);
	}
    }

    if (L.system.fullscreen) {
	//var CSSOptions = "margin: 0px; padding: 0px; border-width: 0px;	overflow:hidden;";
	//document.body.style = CSSOptions;
	//document.getElementsByTagName("html")[0].style = CSSOptions;
	//L.system.renderCanvas[0].style = "margin:0px auto; transition-property: all; transition-duration: 1s; transition-timing-function: ease;" + CSSOptions;
	L.display.autoResize();
	window.addEventListener('resize', L.display.autoResize, true);
    }


};

L.system.setLoadScreen = function()
{
    var system = L.system;
    var width = system.width;
    var height = system.height;
    var objects = L.objects;
    var mainColour = "#eeeeee";

    var loadScreen = new objects.Scene();
    loadScreen.bgFill = "#000000";
    var text = new objects.Textbox("Ludix", width / 2, height / 2 - 75);
    text.alignment = "center";
    text.backgroundFill = "";
    text.textFill = mainColour;
    text.fontSize = 50;
    text.autoSize();

    var iMake = new objects.Textbox("https://github.com/Loycifer/Ludix.js", width / 2, height / 2);
    iMake.alignment = "center";

    iMake.textFill = mainColour;
    iMake.backgroundFill = "";
    iMake.fontSize = 20;
    iMake.visible = false;
    iMake.autoSize();
    loadScreen.layers["background"].addObject(text);
    var screenTimer = {
	state: "loading",
	timer: 4
    };
    screenTimer.update = function(dt)
    {
	var timer = this.timer;
	switch (this.state)
	{
	    case "loading":
		if (system.expectedResources === system.loadedResources)
		{
		    //L.game.main();
		    this.state = "ready";
		    iMake.visible = true;
		}
		break;
	    case "ready":
		if (timer <= 0)
		{
		    this.timer = 3;
		    this.state = "fadeOut";
		}
		if (progressBar.alpha > 0)
		{
		    progressBar.alpha -= 0.5 * dt;
		}
		if (progressBar.alpha < 0)
		{
		    progressBar.alpha = 0;
		}
		if (lineObject.alpha > 0)
		{
		    lineObject.alpha -= 0.5 * dt;
		}
		if (lineObject.alpha < 0)
		{
		    lineObject.alpha = 0;
		}
		this.timer -= 1 * dt;
		break;
	    case "fadeOut":
		if (timer <= 0)
		{
		    L.game.main();
		}
		if (text.alpha > 0)
		{
		    text.alpha -= 1 * dt;
		}
		if (text.alpha < 0)
		{
		    text.alpha = 0;
		}
		if (iMake.alpha > 0)
		{
		    iMake.alpha -= 1 * dt;
		}
		if (iMake.alpha < 0)
		{
		    iMake.alpha = 0;
		}
		this.timer -= 1 * dt;
		break;
	    default:
		break;
	}

    };
    var progressBar = {
	alpha: 1
    };
    progressBar.draw = function(layer)
    {
	var left = width * 0.25;

	var ratio = system.loadedResources / system.expectedResources;
	layer.globalAlpha = this.alpha;
	layer.beginPath();
	layer.lineWidth = 3;
	layer.strokeStyle = mainColour;
	layer.fillStyle = mainColour;
	layer.rect(left, height / 2, left * 2, 30);
	layer.stroke();
	layer.fillRect(left + 4, height / 2 + 4, ratio * (left * 2 - 8), 30 - 8);
    };
    progressBar.update = function(dt)
    {

    };

    var lineObject = {
	alpha: 1
    };
    lineObject.draw = function(layer)
    {
	if (this.alpha > 0)
	{
	layer.globalAlpha = this.alpha;
	layer.lineWidth = 1;
	layer.strokeStyle = "#000000";
	layer.beginPath();
	for (var i = 0.5, h = height, w = width; i < h; i += 2)
	{
	    layer.moveTo(0, i);
	    layer.lineTo(w, i);
	}
	layer.stroke();
    }
    };
    loadScreen.layers["background"].addObject(progressBar);
    loadScreen.layers["background"].addObject(iMake);
    loadScreen.layers["background"].addObject(screenTimer);
    loadScreen.layers["background"].addObject(lineObject);
    loadScreen.setScene();
};
