var L;
L.objects = {};
L.objects.Sprite = function(textureName, options)
{
    this.animations =
    {
	idle: []
    };

    this.animations.idle[0] =
    {
	img: L.texture[textureName],
	length: 1000
    };

    if (this.animations.idle[0].img)
    {
	L.log("Created Sprite from texture \"" + textureName + "\".");
    }

    this.x = (options && options.x) ? options.x : 0;
    this.y = (options && options.y) ? options.y : 0;
    this.z = (options && options.z) ? options.z : 0;

    this.width = (options && options.width) ? options.width : this.animations.idle[0].img.width;
    this.height = (options && options.height) ? options.height : this.animations.idle[0].img.height;

    Object.defineProperty(this, "center", {
	get: function() {
	    return {
		x: this.width / 2,
		y: this.height / 2
	    };
	}.bind(this)
    });

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

L.objects.Sprite.prototype.update = function(dt)
{
    this.autoUpdate(dt);
};


L.objects.Sprite.prototype.autoUpdate = function(dt)
{
    this.speedX += this.accelX * dt * L.system.timeScale;
    this.speedY += this.accelY * dt * L.system.timeScale;
    this.x += this.speedX * dt * L.system.timeScale;
    this.y += this.speedY * dt * L.system.timeScale;
    this.rotation += this.rotationAccel * dt * L.system.timeScale;
    this.angle += this.rotation * dt * L.system.timeScale;
};

L.objects.Sprite.prototype.experimentalUpdate = function(dt)
{
    //alert(this.landingTime);

    this.time += dt * L.system.timeScale;
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
	Math.jordanCurve(mouseX, mouseY, this.getVertices())))
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
    this.draw(layer);
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

L.objects.Sprite.prototype.moveX = function(x)
{
    this.move({
	x: x,
	y: 0
    });
};

L.objects.Sprite.prototype.moveY = function(y)
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
    var length = this.nudeVertices.length;

    if (this.angle !== 0)
    {
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

L.Frame = function(textureName, length)
{
    this.img = L.texture[textureName];
    this.length = length;
};

L.Animation = function(frames)
{

};