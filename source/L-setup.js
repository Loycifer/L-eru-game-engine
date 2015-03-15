var L;



L.system.setResolution = function(xRes, yRes)
{
    if (isNaN(xRes) || isNaN(yRes))
    {
	alert("L.system.setResolution() parameters must be numeric.");
    }
    L.system.width = xRes;
    L.system.height = yRes;
};

L.system.setFullscreen = function(fullscreen)
{
    if (fullscreen !== false && fullscreen !== true)
    {
	alert("L.system.setFullscreen() parameter must be boolean.");
    }
    L.system.fullscreen = fullscreen;
};

L.system.setOrientation = function(orientation)
{
    var lowOrientation = orientation.toLowerCase();
    if (["auto", "landscape", "portrait"].indexOf(lowOrientation) === -1)
    {
	alert("L.system.setOrientation() parameter must be \"auto\", \"landscape\", or \"portrait\".");
    }
    L.system.orientation = lowOrientation;
};

L.system.setAutoPause = function(autoPause)
{
    if (autoPause !== false && autoPause !== true)
    {
	alert("L.system.setAutoPause() parameter must be boolean.");
    }
    L.system.autoPause = autoPause;
};

L.system.setCanvasLocation = function(DOMElement)
{
    if (!(DOMElement instanceof HTMLElement))
    {
	alert("L.system.setCanvasLocation() parameter must be a DOM element.");
    }
    L.system.canvasLocation = DOMElement;
};


L.system.setup = function()
{
    var width = L.system.width;
    var height = L.system.height;
    var aspectRatio = L.system.aspectRatio = width / height;
    if (L.system.orientation !== "auto")
    {
	try {
	    screen.lockOrientation(L.system.orientation);
	}
	catch (e)
	{
	    L.log("Warning: Screen orientation could not be locked.");
	}
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

    if (L.system.autoPause)
    {
	window.addEventListener('blur', function() {
	    L.system.isPaused = true;
	    L.system.then = window.performance.now();
	});
	window.addEventListener('focus', function() {
	    L.system.isPaused = false;
	    L.system.then = window.performance.now();
	});
    }

};

L.system.setLoadScreen = function()
{
    L.load.base64texture("data:image/png;base64,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", "base64test"
    );
    var system = L.system;
    var width = system.width;
    var height = system.height;
    var objects = L.objects;


    var loadScreen = new objects.Scene();
    loadScreen.motionBlur = 1;
    loadScreen.bgFill = "#000000";

    var iMake = new objects.Textbox("https://github.com/Loycifer/Ludix.js", width / 2, 5 * height / 6);
    iMake.alignment = "center";
    iMake.textFill = "black";
    iMake.backgroundFill = "";
    iMake.fontSize = (width / 30);
    iMake.visible = true;
    iMake.autoSize();
    iMake.onClick = function(x, y)
    {
	if (Math.sqrt((Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2))) < textLogo.clipRadius)
	{
	    window.open('https://github.com/Loycifer/Ludix.js');
	}
    };
    iMake.update = function(dt)
    {
	var mouse = L.mouse;
	if (Math.jordanCurve(mouse.x, mouse.y, this.getVertices()))
	{
	    iMake.textFill = "blue";

	}
	else
	{
	    iMake.textFill = "black";
	}
    };
    var iMakeClicker = {
	handleClick: function(x, y, e)
	{
	    iMake.handleClick(x, y, e);
	}
    };


    var loadingText = new objects.Textbox("0%", width / 2 * 1.03, (height / 2) + (width / 8) + (width / 30));
    loadingText.alignment = "right";
    loadingText.textFill = "white";
    loadingText.backgroundFill = "";
    loadingText.fontSize = (width / 30);
    loadingText.y -= loadingText.fontSize / 2;
    loadingText.visible = true;
    loadingText.autoSize();
    loadingText.alpha = 0;

    var textLogo = new objects.Sprite("base64test");
    textLogo.width = 402;
    textLogo.height = 152;
    textLogo.handle = {
	x: 201,
	y: 76
    };
    textLogo.x = width / 2;
    textLogo.y = height / 2;
    textLogo.setScale(0.6 * (width / 2) / textLogo.width);
    textLogo.clipRadius = 0;
    textLogo.draw = function(layer)
    {
	if (this.clipRadius > 0)
	{
	    layer.save();
	    layer.beginPath();
	    layer.arc(this.x, this.y, this.clipRadius, 0, Math.PI * 2, false);
	    layer.clip();

	    this.autoDraw(layer);
	    iMake.draw(layer);

	    layer.restore();
	}
    };

    var fadeRect = {
	alpha: 0
    };
    fadeRect.draw = function(layer)
    {
	layer.globalAlpha = this.alpha;
	layer.fillStyle = "black";
	layer.fillRect(-1, -1, width + 2, height + 2);
    };


    var progressOrb = {
	x: width / 2,
	y: height / 2,
	radius: width / 8,
	maxRadius: Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2,
	orbRatio: 0,
	orbAlpha: 1,
	orbColor: "white",
	lineAlpha: 1,
	lineColor: "white",
	lineWidth: 4,
	growthRatioPerSecond: 0.33,
	divisions: 0,
	divisionColor: "white",
	rainbowWidth: width / 16,
	rainbowColors: ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "white"],
	rainbowTimer: 0,
	loadTimer: 0,
	fadeTimer: 0

    };

    progressOrb.updateLoading = function(dt)
    {
	var potentialRatio = system.loadedResources / system.expectedResources;
	var currentRatio = this.orbRatio;
	this.loadTimer += dt;
	if (this.loadTimer >= 2 && loadingText.alpha < 1)
	{
	    loadingText.alpha += 5 * dt;
	}
	if (loadingText.alpha > 1)
	{
	    loadingText.alpha = 1;
	}
	if (currentRatio < potentialRatio)
	{
	    this.orbRatio += this.growthRatioPerSecond * dt;
	}
	if (this.orbRatio > potentialRatio)
	{
	    this.orbRatio = potentialRatio;
	}

	if (this.orbRatio >= 1)
	{
	    this.orbRatio = 1;
	    this.update = this.updateAnimating;
	    this.draw = this.drawAnimating;
	    loadingText.text = "100%";
	}
	else
	{
	    var text = "000" + Math.floor(this.orbRatio * 100) + "%";

	    loadingText.text = text.substring(text.length - 4, text.length);
	}


    };

    progressOrb.updateAnimating = function(dt)
    {
	iMake.update(dt);
	if (loadingText.alpha > 0)
	{
	    loadingText.alpha -= dt * 10;
	}
	if (loadingText.alpha < 0)
	{
	    loadingText.alpha = 0;
	}
	this.rainbowTimer += dt;
	lineObject.alpha -= dt / 4.5;
	vignette.alpha -= dt / 32;
	textLogo.setScale(textLogo.scale.x + (dt * 0.025));
	if (this.rainbowTimer >= 7)
	{

	    this.update = this.updateFadeOut;

	}


    };

    progressOrb.updateFadeOut = function(dt)
    {
	iMake.update(dt);
	textLogo.setScale(textLogo.scale.x + (dt * 0.025));
	fadeRect.alpha += (dt / 2);
	if (fadeRect.alpha > 1)
	{
	    fadeRect.alpha = 1;
	}
	if (fadeRect.alpha === 1)
	{
	    this.fadeTimer += dt;

	}
	if (this.fadeTimer > 1)
	{
	    L.game.main();
	}

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
	var maxRadius = this.maxRadius;
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

	    if (i === 7 || (currentRadius - width) < maxRadius)
	    {
		layer.beginPath();
		var radius = (currentRadius < maxRadius) ? currentRadius : maxRadius;
		if (i === 7)
		{
		    textLogo.clipRadius = radius;
		}
		layer.arc(this.x, this.y, radius, 0, 2 * Math.PI);
		layer.fillStyle = this.rainbowColors[i];
		layer.fill();

		layer.stroke();
	    }
	}

    };

    progressOrb.drawLoading = function(layer)
    {
	this.drawDivisions(layer);
	this.drawOrb(layer, this.orbRatio);
	this.drawCircle(layer);
	loadingText.draw(layer);

    };

    progressOrb.drawAnimating = function(layer)
    {
	this.drawOrb(layer, this.orbRatio);
	this.drawCircle(layer);
	loadingText.draw(layer);
	this.drawRainbow(layer);


    };


    progressOrb.draw = progressOrb.drawLoading;


    var vignette = {
	alpha: 1,
	x: width / 2,
	y: height / 2

    };
    vignette.draw = function(layer)
    {
	if (this.alpha > 0)
	{
	    layer.globalAlpha = this.alpha;
	    var gradient = layer.createRadialGradient(this.x, this.y, 0, this.x, this.y, width / 1.9);
	    gradient.addColorStop(0, "rgba(0,0,0,0)");
	    gradient.addColorStop(1, "black");
	    layer.fillStyle = gradient;
	    layer.fillRect(0, 0, width, height);
	}
    };

    var lineObject = {
	alpha: 1,
	colorLineWidth: width / (150 * 3),
	scanLineWidth: (height + 1) / (200),
	colors: ["#ff0000", "#00ff00", "#0000ff"]
    };
    lineObject.draw = function(layer)
    {
	if (this.alpha > 0)
	{
	    for (var colorNumber = 0; colorNumber < 3; colorNumber++)
	    {
		var colorLineWidth = this.colorLineWidth;
		layer.globalAlpha = this.alpha / 3;
		layer.lineWidth = colorLineWidth;
		layer.strokeStyle = this.colors[colorNumber];
		layer.beginPath();
		for (var i = (colorNumber * colorLineWidth) + (colorLineWidth / 2), h = height, w = width; i < w; i += 3 * colorLineWidth)
		{
		    layer.moveTo(i, 0);
		    layer.lineTo(i, h);
		}
		layer.stroke();
	    }
	    layer.globalAlpha = this.alpha * 0.9;
	    layer.lineWidth = 1;//this.scanLineWidth/3;
	    layer.strokeStyle = "#000000";
	    layer.beginPath();
	    for (var i = 0.5, h = height, w = width; i <= h + 1; i += 2)
	    {
		layer.moveTo(0, i);
		layer.lineTo(w, i);
	    }
	    layer.stroke();
	}
    };

    loadScreen.layers["background"].addObject(progressOrb);
    loadScreen.layers["background"].addObject(iMakeClicker);

    loadScreen.layers["background"].addObject(textLogo);
    loadScreen.layers["background"].addObject(lineObject);
    loadScreen.layers["background"].addObject(vignette);
    loadScreen.layers["background"].addObject(fadeRect);

    loadScreen.setScene();
};
