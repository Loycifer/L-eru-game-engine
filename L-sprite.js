var L;
L.objects = {};
L.objects.Sprite = function(textureName, options)
{
    this.animations = {};
    this.animations.default = {};
    this.animations.default[0] = {img: L.texture[textureName], length: 1000};
    if (this.animations.default[0].img)
    {
	L.whisper("Created Sprite from texture \"" + textureName + "\".");
    }
    this.x = (options && options.x) ? options.x : 0;
    this.y = (options && options.y) ? options.y : 0;
    this.z = (options && options.z) ? options.z : 0;

    this.width = (options && options.width) ? options.width : this.animations.default[0].img.width;
    this.height = (options && options.height) ? options.height : this.animations.default[0].img.height;

    this.center = {};
    this.center.x = this.width / 2;
    this.center.y = this.height / 2;

    this.handle = {};
    this.handle.x = (options && options.handle && (options.handle.x || options.handle.x === 0)) ? options.handle.x : this.center.x;
    this.handle.y = (options && options.handle && (options.handle.y || options.handle.y === 0)) ? options.handle.y : this.center.y;

    this.offset = {};
    this.offset.x = 0;
    this.offset.y = 0;

    this.angle = (options && options.angle) ? options.angle : 0;
    this.rotation = (options && options.rotation) ? options.rotation : 0;
    this.speedX = 20;
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
    this.vertices = [];


    this.visible = true;
    this.alpha = (options && options.alpha) ? options.alpha : 1;
    this.blendMode = "";
    
    this.onClick = function(){};

    this.currentAnimation = "default";
    this.currentFrame = 0;
    this.animationTimer;

    this.updateCommands = {};
    this.drawCommands = {};

    this.isClickable = true;

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
	    var radians = this.angle * (Math.PI / 180);
	    layer.save();
	    layer.translate(this.x, this.y);
	    layer.rotate(-radians);
	    layer.drawImage(this.animations.default[this.currentFrame].img, -this.handle.x, -this.handle.y);
	    layer.restore();
	    //layer.rotate(radians);
	    //layer.translate(-this.x, -this.y);
	} else {
	    layer.drawImage(this.animations.default[this.currentFrame].img, this.x - this.handle.x, this.y - this.handle.y);
	}
    }
};

L.objects.Sprite.prototype.update = function()
{
    this.autoUpdate();
};


L.objects.Sprite.prototype.autoUpdate = function()
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
	if (
		mouseX >= this.x + this.offset.x - this.handle.x &&
		mouseX <= this.x + this.width + this.offset.x - this.handle.x &&
		mouseY >= this.y + this.offset.y - this.handle.y &&
		mouseY <= this.y + this.height + this.offset.y - this.handle.y
		)
	{

	    this.onClick();
	

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

    var left = -this.handle.x;
    var top = -this.handle.y;
    var right = left + this.width;
    var bottom = top + this.height;
    var xTransform = this.x;
    var yTransform = this.y;
    var vertices = [
	{
	    x: left,
	    y: top
	},
	{
	    x: right,
	    y: top
	},
	{
	    x: right,
	    y: bottom
	},
	{
	    x: left,
	    y: bottom
	}
    ];
    if (this.angle !== 0)
    {
	var rads = this.angle * (Math.PI / 180);
	vertices.mapQuick(function(entry) {
	    var old = {x: entry.x, y: entry.y};
	    entry.x = old.x * Math.cos(-rads) - old.y * Math.sin(-rads);
	    entry.y = old.x * Math.sin(-rads) + old.y * Math.cos(-rads);
	});
    }
    vertices.mapQuick(function(entry) {
	entry.x += xTransform;
	entry.y += yTransform;
    });
    return vertices;


};


/*
 * int pnpoly(int nvert, float *vertx, float *verty, float testx, float testy)
 {
 int i, j, c = 0;
 for (i = 0, j = nvert-1; i < nvert; j = i++) {
 if ( ((verty[i]>testy) != (verty[j]>testy)) &&
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


/*
 * void Rect::calculateVertices()
 {
 //Let the compiler do some copy-pasting or other fun const optimizations.
 //Also, easier to read.
 const GLfloat WIDTH_SCALE = (m_width / 2) * m_scaleX;
 const GLfloat HEIGHT_SCALE = (m_height / 2) * m_scaleY;
 
 const GLfloat LEFT = m_position.x - WIDTH_SCALE;
 const GLfloat RIGHT = m_position.x + WIDTH_SCALE;
 
 const GLfloat TOP  = m_position.y + HEIGHT_SCALE;
 const GLfloat BOTTOM = m_position.y - HEIGHT_SCALE;
 
 if(m_orientation == 0) // if no rotation
 {
 setVertices(
 &Vertex( LEFT, TOP, m_position.z), 
 &Vertex( RIGHT, TOP, m_position.z),
 &Vertex( RIGHT, BOTTOM, m_position.z),
 &Vertex( LEFT, BOTTOM, m_position.z) );
 }
 else
 {
 const GLfloat radians = (GLfloat)DEG_TO_RAD(m_orientation);
 const GLfloat cosn = (GLfloat)cos(radians);
 const GLfloat sinn = (GLfloat)sin(radians);
 
 Vertex TL = Vertex( (LEFT  * cosn) - (TOP * sinn)   , (LEFT  * sinn) + (TOP *    cosn), m_position.z );
 Vertex TR = Vertex( (RIGHT * cosn) - (TOP * sinn)   , (RIGHT * sinn) + (TOP *    cosn), m_position.z );
 Vertex BR = Vertex( (RIGHT * cosn) - (BOTTOM * sinn), (RIGHT * sinn) + (BOTTOM * cosn), m_position.z );
 Vertex BL = Vertex( (LEFT  * cosn) - (BOTTOM * sinn), (LEFT  * sinn) + (BOTTOM * cosn), m_position.z);
 
 setVertices( &TL, &TR, &BR, &BL );
 
 }
 }
 */	