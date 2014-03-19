
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

	return order * (a[sortBy] - b[sortBy]);


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

    for (var i = length-1; i >= 0; i--)
    {

	if (this[i].isClicked(mouseX, mouseY))
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




L.system.renderCanvas = [];
L.system.renderContext = [];
L.system.bufferCanvas = [];
L.system.bufferContext = [];

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

};

L.objects = {};

L.objects.Scene = function(name)
{
    L.scenes[name] = this;
    this.layers = [];

};

L.objects.Scene.prototype.update = function()
{
    this.autoUpdate();
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
    this.layers.draw();
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



L.objects.Layer = function(targetContext)
{
    this.sorted = true;
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
    this.objects.mapQuick(function(object) {
	object.update();
    });
    if (this.sorted)
    {
	length = this.sortBy.length;
	for (var i=0;i<length;i++)
	this.objects.sortBy(this.sortBy[i], this.sortOrder[i]);
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



L.objects.Sprite = function(textureName, options)
{
    this.animations = {};
    this.animations.idle = {};
    this.animations.idle[0] = {img: L.texture[textureName], length: 1000};
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
    this.nudeTopLeft = [this.nudeLeft,this.nudeTop];
    this.nudeTopRight = [this.nudeRight, this.nudeTop];
    this.nudeBottomLeft = [this.nudeLeft, this.nudeBottom];
    this.nudeBottomRight = [this.nudeRight, this.nudeBottom];
    this.nudeVertices = [this.nudeTopLeft, this.nudeTopRight, this.nudeBottomRight, this.nudeBottomLeft];
    this.vertices = new Array(this.nudeVertices.length);
    
    this.angle = (options && options.angle) ? options.angle : 0;
    this.rotation = (options && options.rotation) ? options.rotation : 0;
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
    
    this.onClick = function(){alert("click");};

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
	    //layer.rotate(radians);
	    //layer.translate(-this.x, -this.y);
	} else {
	    layer.drawImage(this.animations.idle[this.currentFrame].img, this.x - this.handle.x, this.y - this.handle.y);
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
      layer.lineTo(this.vertices[i][0],this.vertices[i][1]);
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
    this.speedX += this.accelX  * L.system.dt * L.system.timeScale;
    this.speedY += this.accelY  * L.system.dt * L.system.timeScale;
    this.x += this.speedX * L.system.dt * L.system.timeScale;
    this.y += this.speedY  * L.system.dt * L.system.timeScale;
    this.angle+= this.rotation * L.system.dt * L.system.timeScale;
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
	if ((  this.angle === 0 &&
		mouseX >= this.x + this.offset.x - this.handle.x &&
		mouseX <= this.x + this.width + this.offset.x - this.handle.x &&
		mouseY >= this.y + this.offset.y - this.handle.y &&
		mouseY <= this.y + this.height + this.offset.y - this.handle.y
		) || (
		this.angle !== 0 &&
		this.jordanCurve(mouseX,mouseY)))
	{
	  this.onClick();

	    return true;
	    
	}
    }
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
    this.move({x: x, y: 0});
};

L.objects.Sprite.prototype.movey = function(y)
{
    this.move({x: 0, y: y});
};


L.objects.Sprite.prototype.getVertices = function()
{

    var xTransform = this.x + this.offset.x;
    var yTransform = this.y + this.offset.y;
 
    if (this.angle !== 0)
    {
	var length = this.nudeVertices.length;
	
	for (var i =0; i < length; i++)
	{
	    this.vertices[i] = [
		this.nudeVertices[i][0] * Math.cos(-this.angle) - this.nudeVertices[i][1] * Math.sin(-this.angle),
		this.nudeVertices[i][0] * Math.sin(-this.angle) + this.nudeVertices[i][1] * Math.cos(-this.angle)
	    ];
	}
    } 
    else 
    {
	for (var i =0; i < length; i++)
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
    for (var i = 0, j = length-1; i< length; j= i++)
    {
	if ((this.vertices[i][1] > y) !== (this.vertices[j][1] > y))
	{
	    if (x < ((this.vertices[j][0] - this.vertices[i][0]) * (y - this.vertices[i][1])/(this.vertices[j][1]-this.vertices[i][1]) + this.vertices[i][0]))
	    {
		isInPoly = !isInPoly;
	    }
	    
	}
    }
    return isInPoly;
    
};



  function pnpoly(nvert, vertx, verty,  testx,  testy)
 {
 var i, j, c = 0;
 for (i = 0, j = nvert-1; i < nvert; j = i++) {
 if ( ((verty[i]>testy) !== (verty[j]>testy)) &&
 (testx < (vertx[j]-vertx[i]) * (testy-verty[i]) / (verty[j]-verty[i]) + vertx[i]) )
 c = !c;
 }
 return c;
 }
 

L.Frame = function(textureName, length)
{
    this.img = L.texture[textureName];
    this.length = length;
};

L.Animation = function(frames)
{

};

