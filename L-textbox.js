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
	layer.translate(this.x, this.y );
	layer.rotate(-radians);
	
	
	layer.beginPath();
	layer.fillStyle = this.backgroundFill;
	layer.rect( - this.handle.x, - this.handle.y, this.width + this.marginLeft + this.marginRight, this.height + this.marginTop + this.marginBottom);
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
  this.handle.x = (this.getTotalWidth()/2);
  this.alignment = "center";
  return this;
};

L.objects.Textbox.prototype.centerY = function()
{
  this.handle.y = (this.getTotalHeight()/2);
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
	if ((  this.angle === 0 &&
		mouseX >= this.x  - this.handle.x &&
		mouseX <= this.x + this.width + this.marginLeft + this.marginRight - this.handle.x &&
		mouseY >= this.y  - this.handle.y &&
		mouseY <= this.y + this.height + this.marginTop + this.marginBottom - this.handle.y
		) || (
		this.angle !== 0 &&
		this.jordanCurve(mouseX,mouseY)))
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
    var vertices = [[left,top],[right,top],[right,bottom],[left,bottom]];
    if (this.angle !==0)
    {
	var length = vertices.length;
	
	for (var i =0; i < length; i++)
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
    for (var i = 0, j = length-1; i< length; j= i++)
    {
	if ((vertices[i][1] > y) !== (vertices[j][1] > y))
	{
	    if (x < ((vertices[j][0] - vertices[i][0]) * (y - vertices[i][1])/(vertices[j][1]-vertices[i][1]) + vertices[i][0]))
	    {
		isInPoly = !isInPoly;
	    }
	    
	}
    }
    return isInPoly; 
};