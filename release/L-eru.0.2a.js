


Array.prototype.copy = function()
{

    return this.slice(0);
};

Array.prototype.copy2 = function()
{



    var length = this.length;
    var arrayCopy = [];
    for (var i = 0; i < length; i++)
    {
	if (this[i].isArray)
	{
	    arrayCopy[i] = this[i].copy2();
	}
    }
    return arrayCopy.slice(0);
};

Array.prototype.mapQuick = function(callback)
{


    var length = this.length;

    for (var i = 0; i < length; i++)
    {
	callback(this[i], i);
    }
    //return this;
};

Array.prototype.sortBy = function(sorter, order)
{
    var sortBy = sorter;
    var length = this.length;
    if (order === undefined)
    {
	order = 1;
    }


    for (var i = 0; i < length; i++)
    {
	if (this[i] instanceof Array)
	{
	    this[i].sortBy(sortBy, order);
	}
    }

    this.sort(function(a, b) {
	var current = a[sortBy];
	var next = b[sortBy];
	return order * (current - next);


    });
};

Array.prototype.draw = function(targetContext)
{


    var length = this.length;

    for (var i = 0; i < length; i++)
    {
	if (this[i].draw)
	{
	    this[i].draw(targetContext);
	}
    }
    //return this;
};
Array.prototype.update = function()
{


    var length = this.length;

    for (var i = 0; i < length; i++)
    {
	if (this[i].update)
	{
	    this[i].update();
	}
    }
    //return this;
};
Array.prototype.isClicked = function(mouseX, mouseY)
{


    var length = this.length;

    for (var i = length - 1; i >= 0; i--)
    {

	if (this[i].isClicked && this[i].isClicked(mouseX, mouseY))
	{
	    return true;
	}


    }
    //return this;
};
/*
 Number.prototype.clamp = function(min, max) {
 return Math.min(Math.max(this, min), max);
 };

 Number.prototype.isBetween = function (min, max)
 {
 return (this === this.clamp(min,max));
 };


 */

Math.degToRad = function(deg)
{
    return (deg * (Math.PI / 180));
};

Math.radToDeg = function(rad)
{
    return (rad * (180 / Math.PI));
};

Math.vectorX = function(speed, direction)
{

    switch (direction)
    {
	case 0:
	    return speed;
	    break;
	case 180:
	    return -speed;
	    break;
	case 90:
	case -90:
	    return 0;
	    break;
	default:
	    return Math.cos(Math.degToRad(direction)) * speed;
	    break;
    }
};
Math.vectorY = function(speed, direction)
{
    switch (direction)
    {
	case 0:
	case 180:
	    return 0;
	    break;
	case 90:
	    return -speed;
	    break;
	case -90:
	    return speed;
	    break;
	default:
	    return Math.sin(Math.degToRad(direction)) * speed;
	    break;
    }
};

Math.Vector = function(magnitude, direction)
{
    this.magnitude = magnitude;
    this.direction = direction;
};

Math.Vector.prototype.addVector = function(vector)
{
    var d1 = Math.degToRad(this.direction);
    var d2 = Math.degToRad(vector.direction);

    var x1 = Math.cos(d1) * this.magnitude;
    var x2 = Math.cos(d2) * vector.magnitude;

    var y1 = -Math.sin(d1) * this.magnitude;
    var y2 = -Math.sin(d2) * vector.magnitude;

    var adj = x1 + x2;
    var opp = y1 + y2;


    var newDirection = Math.atan(opp / adj);
    var newMagnitude = Math.sqrt((Math.pow(adj, 2) + Math.pow(opp, 2)));

    this.magnitude = newMagnitude;
    this.direction = newDirection;




};




// L ('ɛrɥ) Game Engine
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
L.load.texture = function(name, file)
{
    L.system.expectedResources += 1;
    var thisTexture = new Image();

    thisTexture.onload = function() {
	L.system.loadedResources += 1;
    };
    thisTexture.onerror = function(e) {
	L.shout("Oops! Your browser does not support this audio type.");
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




window.onunload = function() {
    L = null;
};

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

var L;


L.system.renderCanvas = [];
L.system.renderContext = [];
L.system.bufferCanvas = [];
L.system.bufferContext = [];
L.system.fxCanvas = [];
L.system.fxContext = [];
L.system.pixelCanvas = [];
L.system.pixelContext = [];

L.system.setup = function()
{
    var width = L.system.width;
    var height = L.system.height;
    L.system.renderCanvas[0] = document.createElement("canvas");
    L.system.renderCanvas[0].width = width;
    L.system.renderCanvas[0].height = height;
    L.system.canvasLocation.appendChild(L.system.renderCanvas[0]);
    L.system.renderContext[0] = L.system.renderCanvas[0].getContext("2d");

    L.system.bufferCanvas[0] = document.createElement('canvas');
    L.system.bufferCanvas[0].width = width;
    L.system.bufferCanvas[0].height = height;
    L.system.bufferContext[0] = L.system.bufferCanvas[0].getContext("2d");

    L.system.fxCanvas[0] = document.createElement('canvas');
    L.system.fxCanvas[0].width = width;
    L.system.fxCanvas[0].height = height;
    L.system.fxContext[0] = L.system.bufferCanvas[0].getContext("2d");

    L.system.pixelCanvas[0] = document.createElement('canvas');
    L.system.pixelCanvas[0].width = 1;
    L.system.pixelCanvas[0].height = 1;
    L.system.pixelContext[0] = L.system.bufferCanvas[0].getContext("2d");




    L.system.canvasX = L.system.renderCanvas[0].offsetLeft;
    L.system.canvasY = L.system.renderCanvas[0].offsetTop;


    L.system.handleClick = function(e)
    {

	var mouseX = e.pageX - L.system.canvasX;
	var mouseY = e.pageY - L.system.canvasY;
	L.system.currentScene.isClicked(mouseX, mouseY);
    };

    L.system.renderCanvas[0].addEventListener
    (
    'click',
    L.system.handleClick

    );

    window.addEventListener("keydown", doKeyDown, true);
    function doKeyDown(event) {
	L.system.currentScene.doKeyDown(event);
    }

};

var L;
L.objects = {};
L.objects.Sprite = function(textureName, options)
{
    this.animations = {};
    this.animations.idle = {};
    this.animations.idle[0] = {
	img: L.texture[textureName],
	length: 1000
    };
    if (this.animations.idle[0].img)
    {
	L.whisper("Created Sprite from texture \"" + textureName + "\".");
    }
    this.x = (options && options.x) ? options.x : 0;
    this.y = (options && options.y) ? options.y : 0;
    this.z = (options && options.z) ? options.z : 0;

    this.width = (options && options.width) ? options.width : this.animations.idle[0].img.width;
    this.height = (options && options.height) ? options.height : this.animations.idle[0].img.height;

    this.center = {};
    this.center.x = this.width / 2;
    this.center.y = this.height / 2;

    this.handle = {};
    this.handle.x = (options && options.handle && (options.handle.x || options.handle.x === 0)) ? options.handle.x : this.center.x;
    this.handle.y = (options && options.handle && (options.handle.y || options.handle.y === 0)) ? options.handle.y : this.center.y;

    this.offset = {};
    this.offset.x = 0;
    this.offset.y = 0;

    this.nudeTop = 0 - this.handle.y;
    this.nudeLeft = 0 - this.handle.x;
    this.nudeRight = this.nudeLeft + this.width;
    this.nudeBottom = this.nudeTop + this.height;
    this.nudeTopLeft = [this.nudeLeft, this.nudeTop];
    this.nudeTopRight = [this.nudeRight, this.nudeTop];
    this.nudeBottomLeft = [this.nudeLeft, this.nudeBottom];
    this.nudeBottomRight = [this.nudeRight, this.nudeBottom];
    this.nudeVertices = [this.nudeTopLeft, this.nudeTopRight, this.nudeBottomRight, this.nudeBottomLeft];
    this.vertices = new Array(this.nudeVertices.length);

    this.angle = (options && options.angle) ? options.angle : 0;
    this.rotation = (options && options.rotation) ? options.rotation : 0;
    this.rotationAccel = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.accelX = 0;
    this.accelY = 0;
    this.accelDirection = 0;
    this.nextX = this.x;
    this.nextY = this.y;
    this.nextSpeedX = this.speedX;
    this.nextSpeedY = this.speedY;


    this.wrapX = true;
    this.wrapY = false;
    this.boundingType = "rect";



    this.visible = true;
    this.alpha = (options && options.alpha) ? options.alpha : 1;
    this.blendMode = "";

    this.onClick = function() {
	alert("click");
    };

    this.currentAnimation = "idle";
    this.currentFrame = 0;
    this.animationTimer;

    this.updateCommands = {};
    this.drawCommands = {};

    this.isClickable = true;


//Predictive physics experimentation
    this.gravity = 0;
    this.g = 1000;
    this.direction = -Math.PI / 2;
    this.v = 0;
    this.y0 = 500 - this.y;
    this.energy = this.y0;
    this.time = 0;
    this.bounces = 0;
    this.landingTime = (this.v * Math.sin(this.direction) + Math.sqrt(Math.pow((this.v * Math.sin(this.direction)), 2) + (2 * this.g * this.y0))) / this.g;



};

L.objects.Sprite.prototype.draw = function(layer)
{
    this.autoDraw(layer);
};

L.objects.Sprite.prototype.autoDraw = function(layer)
{
    layer.globalAlpha = this.alpha;
    if (this.alpha > 0.0 && this.visible)
    {
	if (this.angle !== 0)
	{
	    var radians = this.angle;
	    layer.save();
	    layer.translate(this.x, this.y);
	    layer.rotate(-radians);
	    layer.drawImage(this.animations.idle[this.currentFrame].img, -this.handle.x, -this.handle.y);
	    layer.restore();
	} else {
	    layer.drawImage(this.animations.idle[this.currentFrame].img, this.x - this.handle.x, this.y - this.handle.y);
	}
    }
};

L.objects.Sprite.prototype.autoDrawCustom = function(layer, options)
{
    layer.globalAlpha = (options && options.opacity !== undefined) ? options.opacity : this.alpha;
    if (this.alpha > 0.0 && this.visible)
    {
	if (this.angle !== 0)
	{
	    layer.save();
	    layer.translate(this.x, this.y);
	    layer.rotate(-this.angle);
	    layer.drawImage((options && options.texture !== undefined) ? options.texture : this.animations.idle[this.currentFrame].img, -this.handle.x, -this.handle.y);
	    layer.restore();
	} else {
	    layer.drawImage((options && options.texture !== undefined) ? options.texture : this.animations.idle[this.currentFrame].img, this.x - this.handle.x, this.y - this.handle.y);
	}
    }
};



L.objects.Sprite.prototype.drawBoundingBox = function(layer)
{
    layer.beginPath();
    this.getVertices();
    layer.moveTo(this.vertices[3][0], this.vertices[3][1]);
    for (var i = 0; i < 4; i++)
    {
	layer.lineTo(this.vertices[i][0], this.vertices[i][1]);
    }
    layer.closePath();
    layer.strokeStyle = "#FFFFFF";
    layer.lineWidth = 2;
    layer.stroke();
};

L.objects.Sprite.prototype.update = function()
{
    this.autoUpdate();
};


L.objects.Sprite.prototype.autoUpdate = function()
{
    this.speedX += this.accelX * L.system.dt * L.system.timeScale;
    this.speedY += this.accelY * L.system.dt * L.system.timeScale;
    this.x += this.speedX * L.system.dt * L.system.timeScale;
    this.y += this.speedY * L.system.dt * L.system.timeScale;
    this.rotation += this.rotationAccel * L.system.dt * L.system.timeScale;
    this.angle += this.rotation * L.system.dt * L.system.timeScale;
};

L.objects.Sprite.prototype.experimentalUpdate = function()
{
    //alert(this.landingTime);

    this.time += L.system.dt * L.system.timeScale;
    if (this.time >= this.landingTime)
    {

	if (this.energy < 1)
	{
	    this.energy = 0;
	}
	//this.energy *= 1.01;
	this.direction = Math.PI / 2;
	this.y0 = 0;
	this.v = Math.sqrt((this.g * 2 * this.energy) / (Math.pow(Math.sin(this.direction), 2)));




	this.time -= this.landingTime;

	this.landingTime = (this.v * Math.sin(this.direction) + Math.sqrt(Math.pow((this.v * Math.sin(this.direction)), 2) + (2 * this.g * this.y0))) / this.g;

    }


    if (this.landingTime < L.system.dt * L.system.timeScale)
    {
	this.y = 500;
    } else {
	this.y = 500 - this.y0 - (this.v * Math.sin(this.direction) * this.time - (this.g * this.time * this.time / 2));
    }
    if (this.y >= 500) {
	this.y = 500;
    }

    this.nextY = this.y;




    this.nextSpeedX += this.accelX * L.system.dt * L.system.timeScale;
    //  this.nextSpeedY += this.accelY * L.system.dt * L.system.timeScale;

    this.nextX += this.nextSpeedX * L.system.dt * L.system.timeScale;
    //   this.nextY += this.nextSpeedY * L.system.dt * L.system.timeScale;


    if (this.nextX >= 800)
    {
	this.nextSpeedX = -this.speedX;
	this.speedX = -this.speedX;
	this.nextX = 799;
    }
    if (this.nextX <= 49)
    {
	this.nextSpeedX = -this.speedX;
	this.speedX = -this.speedX;
	this.nextX = 50;
    }
    //    this.y = (this.nextY);
    this.x = (this.nextX);
    //   this.speedY = (this.nextSpeedY);
    this.speedX = (this.nextSpeedX);
    //  }

    //  this.x += 1;
    // this.y += 1;


};


L.objects.Sprite.prototype.isClicked = function(mouseX, mouseY)
{
    if (this.isClickable)
    {
	if ((this.angle === 0 &&
	mouseX >= this.x + this.offset.x - this.handle.x &&
	mouseX <= this.x + this.width + this.offset.x - this.handle.x &&
	mouseY >= this.y + this.offset.y - this.handle.y &&
	mouseY <= this.y + this.height + this.offset.y - this.handle.y
	) || (
	this.angle !== 0 &&
	this.jordanCurve(mouseX, mouseY)))
	{
	    if (this.isClickedPrecise(mouseX, mouseY))
	    {
		this.onClick();

		return true;
	    }
	}
    }
};

L.objects.Sprite.prototype.isClickedPrecise = function(mouseX, mouseY)
{
    var layer = L.system.pixelContext[0];



    layer.clearRect(-1, -1, 3, 3);
    layer.save();
    layer.translate(-mouseX, -mouseY);
    this.autoDraw(layer);
    layer.restore();
    var pixelData = layer.getImageData(0, 0, 1, 1).data;
    return (pixelData[3] !== 0);



};

L.objects.Sprite.prototype.getSpeedX = function()
{
    return Math.vectorX(this.speed, this.direction);
};

L.objects.Sprite.prototype.getSpeedY = function()
{
    return Math.vectorY(this.speed, this.direction);

};

L.objects.Sprite.prototype.applyForce = function(speed, direction)
{
    var x1 = this.getSpeedX();
    var y1 = this.getSpeedY();
    // var d1 = this.direction;

    var x2 = Math.vectorX(speed, direction);// * L.system.dt* L.system.timeScale;
    var y2 = Math.vectorY(speed, direction);// * L.system.dt * L.system.timeScale;
    //var d2 = direction;


    var adj = x1 + x2;
    var opp = y1 + y2;

    var length = Math.pow((Math.pow(adj, 2) + Math.pow(opp, 2)), 1 / 2);
    var angle = Math.radToDeg(Math.atan2(-opp, adj));
//alert(length);
    this.direction = angle;
    this.speed = length;


};

L.objects.Sprite.prototype.moveTo = function(coords)
{
    this.x = coords.x;
    this.y = coords.y;
};
L.objects.Sprite.prototype.moveToX = function(x)
{
    this.x = x;

};

L.objects.Sprite.prototype.move = function(coords)
{
    this.x += coords.x;
    this.y += coords.y;
};

L.objects.Sprite.prototype.movex = function(x)
{
    this.move({
	x: x,
	y: 0
    });
};

L.objects.Sprite.prototype.movey = function(y)
{
    this.move({
	x: 0,
	y: y
    });
};


L.objects.Sprite.prototype.getVertices = function()
{

    var xTransform = this.x + this.offset.x;
    var yTransform = this.y + this.offset.y;

    if (this.angle !== 0)
    {
	var length = this.nudeVertices.length;

	for (var i = 0; i < length; i++)
	{
	    this.vertices[i] = [
		this.nudeVertices[i][0] * Math.cos(-this.angle) - this.nudeVertices[i][1] * Math.sin(-this.angle),
		this.nudeVertices[i][0] * Math.sin(-this.angle) + this.nudeVertices[i][1] * Math.cos(-this.angle)
	    ];
	}
    }
    else
    {
	for (var i = 0; i < length; i++)
	{
	    this.vertices[i] = [this.nudeVertices[i][0], this.nudeVertices[i][0]];
	}
    }

    this.vertices.mapQuick(function(entry) {
	entry[0] += xTransform;
	entry[1] += yTransform;
    });

    return this.vertices;
};

L.objects.Sprite.prototype.jordanCurve = function(x, y)
{
    var isInPoly = false;
    var length = this.vertices.length;
    this.getVertices();
    for (var i = 0, j = length - 1; i < length; j = i++)
    {
	if ((this.vertices[i][1] > y) !== (this.vertices[j][1] > y))
	{
	    if (x < ((this.vertices[j][0] - this.vertices[i][0]) * (y - this.vertices[i][1]) / (this.vertices[j][1] - this.vertices[i][1]) + this.vertices[i][0]))
	    {
		isInPoly = !isInPoly;
	    }

	}
    }
    return isInPoly;

};



/*function pnpoly(nvert, vertx, verty,  testx,  testy)
 {
 var i, j, c = 0;
 for (i = 0, j = nvert-1; i < nvert; j = i++) {
 if ( ((verty[i]>testy) !== (verty[j]>testy)) &&
 (testx < (vertx[j]-vertx[i]) * (testy-verty[i]) / (verty[j]-verty[i]) + vertx[i]) )
 c = !c;
 }
 return c;
 }
 */


L.Frame = function(textureName, length)
{
    this.img = L.texture[textureName];
    this.length = length;
};

L.Animation = function(frames)
{

};

var L;

L.objects.Layer = function(targetContext)
{
    this.sorted = false;
    this.sortBy = ["z"];
    this.sortOrder = [1];
    this.objects = [];
    this.targetContext = targetContext;
    this.layerAlpha = 1;
    this.isClickable = true;
};

L.objects.Layer.prototype.draw = function()
{
    this.autoDraw();
};

L.objects.Layer.prototype.autoDraw = function()
{
    this.objects.draw(this.targetContext);

};

L.objects.Layer.prototype.update = function()
{

    this.autoUpdate();
};

L.objects.Layer.prototype.autoUpdate = function()
{


    this.objects.update();

    if (this.sorted)
    {
	length = this.sortBy.length;
	for (var i = 0; i < length; i++)
	{
	    this.objects.sortBy(this.sortBy[i], this.sortOrder[i]);
	}
    }

};


L.objects.Layer.prototype.isClicked = function(mouseX, mouseY)
{

    if (this.isClickable)
    {
	this.objects.isClicked(mouseX, mouseY);
    }
};

L.objects.Layer.prototype.addObject = function(object)
{
    this.objects.push(object);
};

L.objects.Layer.prototype.addObjects = function(objects)
{
    var objectsLength = arguments.length;
    for (var i = 0; i < objectsLength; i++)
    {
	this.addObject(arguments[i]);
    }
};

var L;
L.objects.Scene = function(name)
{
    L.scenes[name] = this;
    this.layers = [];
    this.bgFill = "cornflowerblue";
    this.motionBlur = 0.5;
    this.keymap = {};

};

L.objects.Scene.prototype.update = function()
{
    this.autoUpdate();
};

L.objects.Scene.prototype.doKeyDown = function(event)
{
    this.keymap.doKeyDown(event);
};

L.objects.Scene.prototype.autoUpdate = function()
{

    this.layers.update();

};

L.objects.Scene.prototype.draw = function()
{
    this.autoDraw();
};

L.objects.Scene.prototype.autoDraw = function()
{
    L.system.bufferContext[0].fillStyle = this.bgFill;
    L.system.bufferContext[0].fillRect(0, 0, L.system.width, L.system.height);
    this.layers.draw();
    L.system.renderContext[0].globalAlpha = this.motionBlur;
    L.system.renderContext[0].drawImage(L.system.bufferCanvas[0], 0, 0, L.system.width, L.system.height);
};

L.objects.Scene.prototype.addLayer = function(howMany)
{
    var number = howMany || 1;
    for (var i = 0; i < number; i++)
    {
	this.layers.push(new L.objects.Layer(L.system.bufferContext[0]));
    }
};

L.objects.Scene.prototype.isClicked = function(mouseX, mouseY)
{

    this.layers.isClicked(mouseX, mouseY);
};


L.objects.Scene.prototype.transition = {};

L.objects.Scene.prototype.transition.fadeToColor = function(nextScene, fadeOut, pause, fadeIn, color, callback)
{

    L.transitions.fadeToColor.play(L.system.currentScene, nextScene, fadeOut, pause, fadeIn, color, callback);
};

L.objects.Scene.prototype.transition.fadeToBlack = function(nextScene, fadeOut, pause, fadeIn, callback)
{

    L.transitions.fadeToColor.play(L.system.currentScene, nextScene, fadeOut, pause, fadeIn, "#000000", callback);
};

L.objects.Scene.prototype.transition.instant = function(nextScene, callback)
{

    L.transitions.instant.play(L.system.currentScene, nextScene, callback);
};

var L;
L.objects.Textbox = function(text, x, y, width, height)
{
    //this.text = [];
    this.text = text || "Textbox";
    this.x = x;
    this.y = y;
    this.alpha = 1;
    this.font = "Times";
    this.fontSize = 30;

    this.handle = {};
    this.handle.x = 0;
    this.handle.y = 0;

    this.angle = 0;

    this.speedX = 0;
    this.speedY = 0;
    this.accelX = 0;
    this.accelY = 0;
    this.rotation = 0;

    this.textFill = "#000000";
    this.wrap = true;
    this.alignment = "left";
    this.alignmentY = "top";

    this.width = 0;
    this.height = 0;

    this.backgroundFill = "#FFFFFF";
    this.borderFill = "";
    this.borderWidth = 0;

    this.marginLeft = 5;
    this.marginTop = 5;
    this.marginRight = 5;
    this.marginBottom = 5;

    this.isClickable = true;
};

L.objects.Textbox.prototype.draw = function(layer)
{
    this.autoDraw(layer);

};

L.objects.Textbox.prototype.autoDraw = function(layer)
{

    layer.globalAlpha = this.alpha;
    layer.fillStyle = this.color;
    layer.textAlign = "left";//this.alignment;
    layer.font = this.fontSize + "px " + this.font;
    if (this.angle !== 0)
    {
	var radians = this.angle;
	layer.save();
	layer.translate(this.x, this.y);
	layer.rotate(-radians);


	layer.beginPath();
	layer.fillStyle = this.backgroundFill;
	layer.rect(-this.handle.x, -this.handle.y, this.width + this.marginLeft + this.marginRight, this.height + this.marginTop + this.marginBottom);
	layer.fill();
	if (this.borderWidth > 0)
	{
	    layer.strokeStyle = this.borderFill;
	    layer.lineWidth = this.borderWidth;
	    layer.stroke();
	}
	layer.fillStyle = this.textFill;
	layer.textBaseline = "bottom";
	layer.fillText(this.text, this.marginLeft - this.handle.x, this.marginTop + this.fontSize - this.handle.y);



	//layer.fillText(this.text, 0, 0);
	layer.restore();
    } else {

	layer.beginPath();
	layer.fillStyle = this.backgroundFill;
	layer.rect(this.x - this.handle.x, this.y - this.handle.y, this.width + this.marginLeft + this.marginRight, this.height + this.marginTop + this.marginBottom);
	layer.fill();
	if (this.borderWidth > 0)
	{
	    layer.strokeStyle = this.borderFill;
	    layer.lineWidth = this.borderWidth;
	    layer.stroke();
	}
	layer.fillStyle = this.textFill;
	layer.textBaseline = "bottom";
	layer.fillText(this.text, this.x + this.marginLeft - this.handle.x, this.y + this.marginTop + this.fontSize - this.handle.y);
    }
};


L.objects.Textbox.prototype.update = function()
{
    this.autoUpdate();
};

L.objects.Textbox.prototype.autoUpdate = function()
{

};

L.objects.Textbox.prototype.autoSize = function()
{
    this.autoSizeX();
    this.autoSizeY();
};

L.objects.Textbox.prototype.autoSizeX = function()
{
    this.width = this.getTextWidth();
    this.realign();
};

L.objects.Textbox.prototype.autoSizeY = function()
{
    this.height = this.fontSize;
};

L.objects.Textbox.prototype.getTextWidth = function()
{
    L.system.bufferContext[0].font = this.fontSize + "px " + this.font;
    var metrics = L.system.bufferContext[0].measureText(this.text);
    return metrics.width;
};


L.objects.Textbox.prototype.getTotalWidth = function()
{
    return (this.width + this.marginLeft + this.marginRight);
};

L.objects.Textbox.prototype.getTotalHeight = function()
{
    return (this.height + this.marginTop + this.marginBottom);
};

L.objects.Textbox.prototype.realign = function()
{
    this[this.alignment]();
    this[this.alignmentY]();
};

L.objects.Textbox.prototype.center = function()
{
    this.handle.x = (this.getTotalWidth() / 2);
    this.alignment = "center";
    return this;
};

L.objects.Textbox.prototype.centerY = function()
{
    this.handle.y = (this.getTotalHeight() / 2);
    this.alignmentY = "centerY";
    return this;
};

L.objects.Textbox.prototype.top = function()
{
    this.handle.y = 0;
    this.alignmentY = "top";
    return this;
};

L.objects.Textbox.prototype.bottom = function()
{
    this.handle.y = this.getTotalHeight();
    this.alignmentY = "bottom";
    return this;
};

L.objects.Textbox.prototype.left = function()
{
    this.handle.x = 0;
    this.alignment = "left";
    return this;
};

L.objects.Textbox.prototype.right = function()
{
    this.handle.x = this.getTotalWidth();
    this.alignment = "right";
    return this;
};

L.objects.Textbox.prototype.setMargins = function()
{
    switch (arguments.length)
    {
	case 1:
	    this.marginLeft = this.marginTop = this.marginRight = this.marginBottom = arguments[0];
	    break;
	case 2:
	    this.marginTop = this.marginBottom = arguments[0];
	    this.marginLeft = this.marginRight = arguments[1];
	    break;
	case 3:
	    this.marginTop = arguments[0];
	    this.marginRight = this.marginLeft = arguments[1];
	    this.marginBottom = arguments[2];
	    break;
	case 4:
	    this.marginTop = arguments[0];
	    this.marginRight = arguments[1];
	    this.marginBottom = arguments[2];
	    this.marginLeft = arguments[3];
	    break;
	default:
	    alert("Textbox.setMargins() called with wrong number of arguments.");
	    break;

    }
    this.realign();
    return this;
};

L.objects.Textbox.prototype.isClicked = function(mouseX, mouseY)
{
    if (this.isClickable)
    {
	if ((this.angle === 0 &&
	mouseX >= this.x - this.handle.x &&
	mouseX <= this.x + this.width + this.marginLeft + this.marginRight - this.handle.x &&
	mouseY >= this.y - this.handle.y &&
	mouseY <= this.y + this.height + this.marginTop + this.marginBottom - this.handle.y
	) || (
	this.angle !== 0 &&
	this.jordanCurve(mouseX, mouseY)))
	{
	    this.onClick();

	    return true;

	}
    }
};

L.objects.Textbox.prototype.getVertices = function()
{
    var xTransform = this.x;// + this.offset.x;
    var yTransform = this.y;// + this.offset.y;
    var top = 0 - this.handle.y;
    var left = 0 - this.handle.x;
    var right = left + this.width + this.marginLeft + this.marginRight;
    var bottom = top + this.height + this.marginTop + this.marginBottom;
    var vertices = [[left, top], [right, top], [right, bottom], [left, bottom]];
    if (this.angle !== 0)
    {
	var length = vertices.length;

	for (var i = 0; i < length; i++)
	{
	    vertices[i] = [
		vertices[i][0] * Math.cos(-this.angle) - vertices[i][1] * Math.sin(-this.angle),
		vertices[i][0] * Math.sin(-this.angle) + vertices[i][1] * Math.cos(-this.angle)
	    ];
	}
    }


    vertices.mapQuick(function(entry) {
	entry[0] += xTransform;
	entry[1] += yTransform;
    });


    return vertices;

};

L.objects.Textbox.prototype.jordanCurve = function(x, y)
{

    var isInPoly = false;
    var vertices = this.getVertices();
    var length = vertices.length;
    //alert(vertices);
    for (var i = 0, j = length - 1; i < length; j = i++)
    {
	if ((vertices[i][1] > y) !== (vertices[j][1] > y))
	{
	    if (x < ((vertices[j][0] - vertices[i][0]) * (y - vertices[i][1]) / (vertices[j][1] - vertices[i][1]) + vertices[i][0]))
	    {
		isInPoly = !isInPoly;
	    }

	}
    }
    return isInPoly;
};

var L;
L.transitions = {};

L.transitions.instant = {};

L.transitions.instant.play = function(lastScene, nextScene, callback)
{
    if (lastScene.exit) {
	lastScene.exit();
    }
    if (callback) {
	callback(nextScene);
    }

    L.system.currentScene = nextScene;
};




L.transitions.fadeToColor =
{
    lastScene: {},
    nextScreen: {},
    timer: 0,
    state: "start"
};
L.transitions.fadeToColor.play = function(lastScene, nextScene, fadeOut, pause, fadeIn, color, callback)
{
    this.lastScene = lastScene;
    this.nextScene = nextScene;
    this.currentScene = lastScene;
    this.fadeOut = fadeOut;
    this.pause = pause;
    this.fadeIn = fadeIn;
    this.timer = fadeOut;
    this.state = "start";
    this.color = color || "#000000";
    this.callback = callback || function() {
    };
    L.system.currentScene = this;
};

L.transitions.fadeToColor.update = function()
{
    switch (this.state)
    {
	case "start":
	    this.timer = this.fadeOut;
	    this.lastScene.update();
	    this.state = "fadeOut";
	    break;
	case "fadeOut":
	    this.timer -= L.system.dt;
	    this.lastScene.update();
	    if (this.timer <= 0)
	    {
		this.timer = this.pause;
		this.callback(this.nextScene);
		this.state = "pause";
	    }
	    break;
	case "pause":
	    this.timer -= L.system.dt;
	    if (this.timer <= 0)
	    {
		this.timer = this.fadeIn;
		this.state = "fadeIn";
	    }
	    break;
	case "fadeIn":
	    this.timer -= L.system.dt;
	    this.nextScene.update();
	    if (this.timer <= 0)
	    {
		L.system.currentScene = this.nextScene;
	    }
	    break;
	default:
	    alert("Hey!");
	    break;
    }
};

L.transitions.fadeToColor.draw = function()
{
    switch (this.state)
    {
	case "start":
	case "fadeOut":
	    this.lastScene.draw();
	    L.system.renderContext[0].fillStyle = this.color;
	    L.system.renderContext[0].globalAlpha = 1 - this.timer / this.fadeOut;
	    L.system.renderContext[0].fillRect(0, 0, L.system.width, L.system.height);
	    break;
	case "pause":
	    L.system.renderContext[0].fillStyle = this.color;
	    L.system.renderContext[0].globalAlpha = 1;
	    L.system.renderContext[0].fillRect(0, 0, L.system.width, L.system.height);
	    break;
	case "fadeIn":
	    this.nextScene.draw();
	    L.system.renderContext[0].fillStyle = this.color;
	    L.system.renderContext[0].globalAlpha = this.timer / this.fadeIn;
	    L.system.renderContext[0].fillRect(0, 0, L.system.width, L.system.height);
	    break;
	default:
	    alert("hey!");
	    break;

    }
};

var L;
L.input = {};

L.input.keyCodeFromString = function(string)
{
    var upString = string.toUpperCase();
    if (upString.match(/^[A-Z0-9]$/))
    {
	return upString.charCodeAt(0);
    }

    if (upString.indexOf("NUMPAD") === 0)
    {
	return 96 + parseInt(upString.charAt(upString.length - 1));
    }

    if (upString.indexOf("F") === 0)
    {
	return 111 + parseInt(upString.replace("F", ""));
    }

    switch (upString)
    {
	case "MULTIPLY":
	    return 106;

	case "ADD":
	    return 107;

	case "ENTER":
	    return 13;

	case "SUBTRACT":
	    return 109;

	case "DECIMAL":
	    return 110;

	case "DIVIDE":
	    return 111;

	case "BACKSPACE":
	case "BACK":
	    return 8;

	case "TAB":
	    return 9;

	case "SHIFT":
	    return 16;

	case "CONTROL":
	case "CTRL":
	    return 17;

	case "CAPS":
	case "CAPSLOCK":
	case "CAPS LOCK":
	    return 20;

	case "ESC":
	case "ESCAPE":
	    return 27;

	case "SPACE":
	case "SPACEBAR":
	    return 32;

	case "PGUP":
	case "PAGEUP":
	case "PAGE UP":
	    return 33;

	case "PGDN":
	case "PAGEDOWN":
	case "PAGE DOWN":
	    return 34;

	case "END":
	    return 35;

	case "HOME":
	    return 36;

	case "LEFT":
	case "LEFTARROW":
	case "LEFT ARROW":
	    return 37;

	case "UP":
	case "UPARROW":
	case "UP ARROW":
	    return 38;

	case "RIGHT":
	case "RIGHTARROW":
	case "RIGHT ARROW":
	    return 39;

	case "DOWN":
	case "DOWNARROW":
	case "DOWN ARROW":
	    return 40;

	case "INSERT":
	    return 45;

	case "DELETE":
	    return 46;

	case "NUMLOCK":
	case "NUM LOCK":
	    return 144;

	case "SCRLK":
	case "SCROLLLOCK":
	case "SCROLL LOCK":
	    return 145;

	case "PAUSE":
	case "PAUSEBREAK":
	case "PAUSE BREAK":
	    return 19;

	case ";":
	case ":":
	    return 186;

	case "=":
	case "+":
	    return 187;

	case "-":
	case "_":
	    return 198;

	case "/":
	case "?":
	    return 191;

	case "~":
	case "`":
	    return 192;

	case "[":
	case "{":
	    return 219;

	case "\"":
	case "|":
	case "BACKSLASH":
	    return 220;

	case "]":
	case "}":
	    return 221;

	case "'":
	case '"':
	case "QUOTE":
	case "QUOTES":
	    return 222;

	case ",":
	case "<":
	    return 188;

	case ".":
	case ">":
	    return 190;

	default:
	    alert("'" + string + "' is not a valid key identifier.");
	    break;
    }
};

L.input.Keymap = function()
{
    this.bindings = {};
};

L.input.Keymap.prototype.doKeyDown = function(event)
{
    var keyCode = event.keyCode;
    if (this.bindings[keyCode])
    {
	this.bindings[keyCode]();
    }
};

L.input.Keymap.prototype.bindKey = function(key, callback)
{
    this.bindKeyCode(L.input.keyCodeFromString(key), callback);
};

L.input.Keymap.prototype.bindKeyCode = function(keyCode, callback)
{
    this.bindings[keyCode] = callback;
};

