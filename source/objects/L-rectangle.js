/* global L */

/**
 * Creates a new Rectangle
 * @constructor
 * @param {object.<string, number|string|array|object>} [options]
 * @returns {L.objects.Rectangle}
 */
L.objects.Rectangle = function(width, height, options)
{

    /*
     * Animations properties are placeholders for future implementation of
     * frame-based animation
     */



    /*
     this.texture = L.texture[textureName];

     if (this.texture && this.texture.width > 0)
     {
     this.width = this.texture.width;
     this.height = this.texture.height;
     L.log("Setting Rectangle dimensions to " + this.width + " by " + this.height + ".");
     }
     */

    this.width = width;
    this.height = height;

    this.fillstyle = "";
    this.lineWidth = 2;
    this.strokeStyle = "";

    this.handle = {
	x: 0,
	y: 0
    };
    this.offset = {
	x: 0,
	y: 0
    };
    this.scale = {
	x: 1,
	y: 1
    };
    for (var propertyName in options)
    {
	if (options.hasOwnProperty(propertyName)) {
	    L.log("Adding property " + propertyName + " to Rectangle object with with value " + JSON.stringify(options[propertyName]) + ".");
	    this[propertyName] = options[propertyName];
	}
    }

    Object.defineProperty(this, "center", {
	get: function() {
	    return {
		x: this.width / 2,
		y: this.height / 2
	    };
	}.bind(this)
    });





    this.nudeTop = 0;
    this.nudeLeft = 0;
    this.nudeRight = this.nudeLeft + this.width;
    this.nudeBottom = this.nudeTop + this.height;
    this.nudeTopLeft = [this.nudeLeft, this.nudeTop];
    this.nudeTopRight = [this.nudeRight, this.nudeTop];
    this.nudeBottomLeft = [this.nudeLeft, this.nudeBottom];
    this.nudeBottomRight = [this.nudeRight, this.nudeBottom];
    this.nudeVertices = [this.nudeTopLeft, this.nudeTopRight, this.nudeBottomRight, this.nudeBottomLeft];
    this.vertices = new Array(this.nudeVertices.length);

    this.rotationAccel = 0;

    this.accelDirection = 0;
    this.nextX = this.x;
    this.nextY = this.y;
    this.nextSpeedX = this.speedX;
    this.nextSpeedY = this.speedY;
    this.wrapX = true;
    this.wrapY = false;
    this.boundingType = "rect";


    this.blendMode = "";
    this.onClick = function() {

    };
    this.currentAnimation = "idle";
    this.currentFrame = 0;
    this.animationTimer;
    this.updateCommands = {};
    this.drawCommands = {};

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

    return this;


};

//Rectangle Instance Properties

L.objects.Rectangle.prototype.x = 0;
L.objects.Rectangle.prototype.y = 0;
L.objects.Rectangle.prototype.z = 0;
L.objects.Rectangle.prototype.width = 0;
L.objects.Rectangle.prototype.height = 0;

//L.objects.Rectangle.prototype.scale = 1;
L.objects.Rectangle.prototype.angle = 0;
L.objects.Rectangle.prototype.rotation = 0;
L.objects.Rectangle.prototype.alpha = 1;
L.objects.Rectangle.prototype.speedX = 0;
L.objects.Rectangle.prototype.speedY = 0;
L.objects.Rectangle.prototype.accelX = 0;
L.objects.Rectangle.prototype.accelY = 0;
L.objects.Rectangle.prototype.visible = true;
L.objects.Rectangle.prototype.isClickable = true;


//Rectangle Instance Methods

/**
 * Sets the sprite's handle coordinates to x and y
 * @method
 * @param {number} x
 * @param {number} y
 * @returns {L.objects.Rectangle}
 */
L.objects.Rectangle.prototype.setHandle = function(x, y)
{
    this.handle = {
	x: x,
	y: y
    };
    return this;
};

//Fix name in personal code
L.objects.Rectangle.prototype.setHandleXY = L.objects.Rectangle.prototype.setHandle;

/**
 * Sets the sprite's proportinal scaling value. Currently only
 * accepts on value
 * @method
 * @param {number} scale
 * @returns {L.objects.Rectangle}
 */
L.objects.Rectangle.prototype.setScale = function(scale)
{
    this.scale = {
	x: scale,
	y: scale
    };
    return this;
};

/**
 *
 * Multiplies the sprite's scale by a scalar
 * @method
 * @param {number} scalar
 * @returns {L.objects.Rectangle}
 */
L.objects.Rectangle.prototype.multiplyScale = function(scalar)
{
    this.scale = {
	x: scalar * this.scale.x,
	y: scalar * this.scale.y
    };
    return this;
};

L.objects.Rectangle.prototype.flipHorizontal = function()
{
    this.scale.x *= -1;
    return this;
};
L.objects.Rectangle.prototype.flipVertical = function()
{
    this.scale.y *= -1;
    return this;
};
L.objects.Rectangle.prototype.getX = function()
{
    return this.x + this.offset.x;
};
L.objects.Rectangle.prototype.getY = function()
{
    return this.y + this.offset.y;
};
L.objects.Rectangle.prototype.getScreenX = function()
{
    var currentScene = L.system.currentScene;
    return this.x + this.offset.x - (currentScene.camera.x * currentScene.activeLayer.scrollRateX);
};
L.objects.Rectangle.prototype.getScreenY = function()
{
    var currentScene = L.system.currentScene;
    return this.y + this.offset.y - (currentScene.camera.y * currentScene.activeLayer.scrollRateY);
};

L.objects.Rectangle.prototype.autoDraw = function(layer)
{
    if (!this.visible || (this.alpha) <= 0.0) {
	return;
    }
    var angle = this.angle;
    var screenX = this.getScreenX();
    var screenY = this.getScreenY();
    var scale = this.scale;
    // var texture = this.texture;
    layer.globalAlpha = this.alpha;

    if (true)
    {
	layer.save();
	layer.translate(screenX, screenY);
	layer.scale(scale.x, scale.y);
	layer.rotate(-angle);
	layer.beginPath();

	layer.rect(-this.handle.x, -this.handle.y, this.width, this.height);
	if (this.fillStyle !== "")
	{
	    if (this.fillStyle !== layer.fillStyle)
	    {
		layer.fillStyle = this.fillStyle;
	    }
	    layer.fill();
	}
	if (this.lineWidth !== 0 && this.strokeStyle !== "")
	{
	    if (this.lineWidth !== layer.lineWidth)
	    {
		layer.lineWidth = this.lineWidth;
	    }
	    if (this.strokeStyle !== layer.strokeStyle)
	    {
		layer.strokeStyle = this.strokeStyle;
	    }
	    layer.stroke();
	}
	layer.restore();
    } else {
	// layer.scale(1/this.scale,1/this.scale);
	layer.drawImage(this.animations[this.currentAnimation][this.currentFrame].img, this.x - this.handle.x, this.y - this.handle.y);
	//layer.scale(this.scale,this.scale);
    }
    return this;
};
L.objects.Rectangle.prototype.draw = L.objects.Rectangle.prototype.autoDraw;

L.objects.Rectangle.prototype.autoDrawCustom = function(layer, options) // do not use
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
L.objects.Rectangle.prototype.drawBoundingBox = function(layer, strokeStyle, lineWidth)
{
    layer.beginPath();
    this.getVertices();
    layer.moveTo(this.vertices[3][0], this.vertices[3][1]);
    for (var i = 0; i < 4; i++)
    {
	layer.lineTo(this.vertices[i][0], this.vertices[i][1]);
    }
    layer.closePath();
    layer.strokeStyle = strokeStyle || "#FFFFFF";
    layer.lineWidth = lineWidth || 2;
    layer.stroke();
    return this;
};

L.objects.Rectangle.prototype.autoUpdate = function(dt)
{
    var timeScale = L.system.timeScale;
    this.speedX += this.accelX * dt * timeScale;
    this.speedY += this.accelY * dt * timeScale;
    this.x += this.speedX * dt * timeScale;
    this.y += this.speedY * dt * timeScale;
    this.rotation += this.rotationAccel * dt * timeScale;
    this.angle += this.rotation * dt * timeScale;
};

L.objects.Rectangle.prototype.handleClick = function(mouseX, mouseY, e)
{
    if (this.isClickable)
    {
	var scale = this.scale;
	var screenX = this.getScreenX();
	var screenY = this.getScreenY();
	if (this.angle === 0)
	{
	    var left = screenX - (scale.x * this.handle.x);
	    var right = left + (scale.x * this.width);
	    var top = screenY - (scale.y * this.handle.y);
	    var bottom = top + (scale.y * this.height);

	    if (left > right)
	    {
		var temp = left;
		left = right;
		right = temp;
	    }

	    if (top > bottom)
	    {
		var temp = top;
		top = bottom;
		bottom = temp;
	    }

	    if (
	    mouseX >= left &&
	    mouseX <= right &&
	    mouseY >= top &&
	    mouseY <= bottom
	    )
	    {
		if (this.isClickedPrecise(mouseX, mouseY))
		{
		    if (e.type === "mousedown" || e.type === "touchstart")
		    {
			this.onClick(mouseX, mouseY, e);

			return true;
		    }
		}
	    }
	} else if (
	this.angle !== 0 &&
	Math.jordanCurve(mouseX, mouseY, this.getVertices()))
	{

	    if (this.isClickedPrecise(mouseX, mouseY))
	    {

		if (e.type === "mousedown" || e.type === "touchstart")
		{
		    this.onClick(mouseX, mouseY, e);

		    return true;
		}
	    }
	}
    }
};

/**
 * Checks if non-empty sprite pixels exist at specific screen coordinates
 * @method
 * @param {number} mouseX
 * @param {number} mouseY
 * @returns {Boolean}
 */
L.objects.Rectangle.prototype.isClickedPrecise = function(mouseX, mouseY)
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


L.objects.Rectangle.prototype.getSpeedX = function()
{
    return Math.vectorX(this.speed, this.direction);
};

L.objects.Rectangle.prototype.getSpeedY = function()
{
    return Math.vectorY(this.speed, this.direction);
};

L.objects.Rectangle.prototype.applyForce = function(speed, direction)
{
    var x1 = this.getSpeedX();
    var y1 = this.getSpeedY();
// var d1 = this.direction;

    var x2 = Math.vectorX(speed, direction); // * L.system.dt* L.system.timeScale;
    var y2 = Math.vectorY(speed, direction); // * L.system.dt * L.system.timeScale;
//var d2 = direction;


    var adj = x1 + x2;
    var opp = y1 + y2;
    var length = Math.pow((Math.pow(adj, 2) + Math.pow(opp, 2)), 1 / 2);
    var angle = Math.radToDeg(Math.atan2(-opp, adj));
//alert(length);
    this.direction = angle;
    this.speed = length;
};

L.objects.Rectangle.prototype.moveTo = function(coords)
{
    this.x = coords.x;
    this.y = coords.y;
};
L.objects.Rectangle.prototype.moveToX = function(x)
{
    this.x = x;
};
L.objects.Rectangle.prototype.move = function(coords)
{
    this.x += coords.x;
    this.y += coords.y;
};
L.objects.Rectangle.prototype.moveX = function(x)
{
    this.move({
	x: x,
	y: 0
    });
};
L.objects.Rectangle.prototype.moveY = function(y)
{
    this.move({
	x: 0,
	y: y
    });
};

L.objects.Rectangle.prototype.centerHandle = function()
{
    this.handle = {
	x: this.center.x,
	y: this.center.y
    };
};

L.objects.Rectangle.prototype.pushProperties = function(obj, propertiesArray)
{
    var arrayLength = propertiesArray.length;
    for (var i = 0; i < arrayLength; i++)
    {
	obj[propertiesArray[i]] = this[propertiesArray[i]];
    }
};

L.objects.Rectangle.prototype.pushPosition = function(obj)
{
    obj.x = this.x;
    obj.y = this.y;
    obj.offset = {
	x: this.offset.x,
	y: this.offset.y
    };
};

/*
 * Needs rewrite:
 * Was trying to keep method from creating too many new objects,
 * but it would be much cleaner to just have this method
 * return an array of points, so that the method can be near
 * identical on all polygonal objects
 */
L.objects.Rectangle.prototype.getVertices = function()
{
    var Math = window.Math;
    var xTransform = this.getScreenX() + this.offset.x;
    var yTransform = this.getScreenY() + this.offset.y;
    var length = this.nudeVertices.length;
    var angle = this.angle;
    var scale = this.scale;
    if (angle !== 0)
    {
	for (var i = 0; i < length; i++)
	{
	    this.vertices[i] = [
		(this.nudeVertices[i][0] - this.handle.x) * Math.cos(-angle) - (this.nudeVertices[i][1] - this.handle.y) * Math.sin(-angle),
		(this.nudeVertices[i][0] - this.handle.x) * Math.sin(-angle) + (this.nudeVertices[i][1] - this.handle.y) * Math.cos(-angle)
	    ];
	}
    } else
    {
	for (var i = 0; i < length; i++)
	{
	    this.vertices[i] = [this.nudeVertices[i][0] - this.handle.x, this.nudeVertices[i][1] - this.handle.y];
	}
    }

    this.vertices.mapQuick(function(entry) {
	entry[0] = (entry[0] * scale.x) + xTransform;
	entry[1] = (entry[1] * scale.y) + yTransform;
    });
    return this.vertices;
};
L.Frame = function(textureName, length)
{
    this.img = L.texture[textureName];
    this.length = length;
};
L.Animation = function(frames)
{

};

L.objects.Rectangle.prototype.experimentalUpdate = function(dt)
{
//alert(this.landingTime);
    var L = L;
    this.time += dt * L.system.timeScale;
    var Math = Math;
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


    if (this.landingTime < dt * L.system.timeScale)
    {
	this.y = 500;
    } else {
	this.y = 500 - this.y0 - (this.v * Math.sin(this.direction) * this.time - (this.g * this.time * this.time / 2));
    }
    if (this.y >= 500) {
	this.y = 500;
    }

    this.nextY = this.y;
    this.nextSpeedX += this.accelX * dt * L.system.timeScale;
//  this.nextSpeedY += this.accelY * dt * L.system.timeScale;

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