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
    //loadScreen.layers["background"].addObject(text);


    var progressOrb = {
	x: system.width / 2,
	y: system.height / 2,
	radius: system.width / 8,
	maxRadius: Math.sqrt(Math.pow(system.width, 2) + Math.pow(system.height, 2)),
	orbRatio: 0,
	orbAlpha: 1,
	orbColor: "white",
	lineAlpha: 1,
	lineColor: "white",
	lineWidth: 4,
	growthRatioPerSecond: 0.33,
	divisions: 0,
	divisionColor: "white",
	rainbowWidth: system.width / 16,
	rainbowColors: ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "white"],
	rainbowTimer: 0

    };

    progressOrb.updateLoading = function(dt)
    {
	var potentialRatio = system.loadedResources / system.expectedResources;
	if (this.orbRatio < potentialRatio)
	{
	    this.orbRatio += this.growthRatioPerSecond * dt;
	}
	if (this.orbRatio >= 1)
	{
	    this.orbRatio = 1;
	    this.update = this.updateAnimating;
	    this.draw = this.drawAnimating;
	}

    };

    progressOrb.updateAnimating = function(dt)
    {
	this.rainbowTimer += dt;
    };


    progressOrb.update = progressOrb.updateLoading;

    progressOrb.drawOrb = function(layer, ratio)
    {
	layer.globalAlpha = this.orbAlpha;
	layer.beginPath();
	layer.arc(this.x, this.y, this.radius * ratio, 0, 2 * Math.PI);
	layer.fillStyle = this.orbColor;
	layer.fill();
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
	    layer.beginPath();

	    var radius = (currentRadius < this.maxRadius) ? currentRadius : this.maxRadius;
	    layer.arc(this.x, this.y, radius, 0, 2 * Math.PI);
	    layer.fillStyle = this.rainbowColors[i];
	    layer.fill();

	    layer.stroke();
	}

    };

    progressOrb.drawLoading = function(layer)
    {
	this.drawDivisions(layer);
	this.drawOrb(layer, this.orbRatio);
	this.drawCircle(layer);
    };

    progressOrb.drawAnimating = function(layer)
    {
	this.drawOrb(layer, this.orbRatio);
	this.drawCircle(layer);
	this.drawRainbow(layer);
    };


    progressOrb.draw = progressOrb.drawLoading;




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
	alpha: 1,
	colorLineWidth:L.system.width/(400),
	scanLineWidth:(L.system.height)/(150),
	colors: ["red", "green", "blue"]
    };
    lineObject.draw = function(layer)
    {
	if (this.alpha > 0)
	{
	    for (var colorNumber = 0; colorNumber < 3; colorNumber++)
	    {
		layer.globalAlpha = this.alpha / 3;
		layer.lineWidth = this.colorLineWidth;
		layer.strokeStyle = this.colors[colorNumber];
		layer.beginPath();
		for (var i = 0.5 + colorNumber*this.colorLineWidth, h = height, w = width; i < w; i += 3*this.colorLineWidth)
		{
		    layer.moveTo(i, 0);
		    layer.lineTo(i, h);
		}
		layer.stroke();
	    }
	    layer.globalAlpha = this.alpha;
	    layer.lineWidth = this.scanLineWidth/3;
	    layer.strokeStyle = "#000000";
	    layer.beginPath();
	    for (var i = 0, h = height, w = width; i <= h+1; i += this.scanLineWidth)
	    {
		layer.moveTo(0, i);
		layer.lineTo(w, i);
	    }
	    layer.stroke();
	}
    };
    // loadScreen.layers["background"].addObject(progressBar);
    loadScreen.layers["background"].addObject(progressOrb);
    loadScreen.layers["background"].addObject(iMake);
    //loadScreen.layers["background"].addObject(screenTimer);
    loadScreen.layers["background"].addObject(lineObject);
    loadScreen.setScene();
};
