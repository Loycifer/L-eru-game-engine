var L;
L.objects.Rectangle = function(options)
{

    for (var propertyName in options)
    {
	L.log("Adding property " + propertyName + " to Sprite object with with value " + JSON.stringify(options[propertyName]) + ".");
	this[propertyName] = options[propertyName];
    }

    Object.defineProperty(this, "center", {
	get: function() {
	    return {
		x: this.width / 2,
		y: this.height / 2
	    };
	}.bind(this)
    });
    this.handle = {
	x: 0,
	y: 0
    };
    this.offset = {
	x: 0,
	y: 0
    };
};

L.objects.Rectangle.prototype.x = 0;
L.objects.Rectangle.prototype.y = 0;
L.objects.Rectangle.prototype.width = 100;
L.objects.Rectangle.prototype.height = 100;
L.objects.Rectangle.prototype.angle = 1;
L.objects.Rectangle.prototype.fillStyle = false;
L.objects.Rectangle.prototype.lineWidth = 1;
L.objects.Rectangle.prototype.lineAlpha = 1;
L.objects.Rectangle.prototype.strokeStyle = "#000000";
L.objects.Rectangle.prototype.strokeAlpha = 1;
L.objects.Rectangle.prototype.lineCap = "butt"; // butt|round|square
L.objects.Rectangle.prototype.lineJoin = "miter"; // miter|round|bevel
L.objects.Rectangle.prototype.visible = true;

L.objects.Rectangle.prototype.draw = function(layer)
{

    var self = this;
    if (self.visible)
    {
	layer.beginPath();
	layer.lineCap = self.lineCap;
	layer.lineJoin = self.lineJoin;
	if (self.angle !== 0)
	{
	    layer.save();
	    layer.translate(self.x, self.y);
	    layer.rotate(-self.angle);

	    layer.rect(-self.handle.x, -self.handle.y, self.width, self.height);
	    if (self.fillStyle)
	    {
		layer.globalAlpha = self.fillAlpha;
		layer.fillStyle = self.fillStyle;
		layer.fill();
	    }
	    if (self.lineWidth)
	    {
		layer.globalAlpha = self.lineAlpha;
		layer.lineWidth = self.lineWidth;
		layer.strokeStyle = self.strokeStyle;
	    }
	    layer.stroke();
	    layer.restore();
	} else {
	    layer.rect(self.x - self.handle.x, self.y - self.handle.y, self.width, self.height);
	    if (self.fillStyle)
	    {
		layer.globalAlpha = self.fillAlpha;
		layer.fillStyle = self.fillStyle;
		layer.fill();
	    }
	    if (self.lineWidth)
	    {
		layer.globalAlpha = self.lineAlpha;
		layer.lineWidth = self.lineWidth;
		layer.strokeStyle = self.strokeStyle;
	    }
	    layer.stroke();
	}
    }
};