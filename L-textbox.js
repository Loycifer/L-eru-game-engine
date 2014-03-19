var L;
L.objects.Textbox = function(text, options)
{
  this.text = text || "Textbox";
  this.x = 0;
  this.y = 0;
  this.alpha = 1;
  this.font = "Times";
  this.fontSize = 30;
  
  this.angle = 0;
  
  this.color = "#000000";
  this.wrap = false;
  this.alignment = "left";
};

L.objects.Textbox.prototype.draw = function(layer)
{
  this.autoDraw(layer);  
  
};

L.objects.Textbox.prototype.autoDraw = function(layer)
{
   
    layer.globalAlpha = this.alpha;
    layer.fillStyle = this.color;
    layer.textAlign = this.alignment;
    layer.font = this.fontSize + "px " + this.font;
    if (this.angle !== 0)
	{
	    var radians = this.angle;
	    layer.save();
	    layer.translate(this.x, this.y);
	    layer.rotate(-radians);
	     layer.fillText(this.text, 0, 0);
	    layer.restore();
	} else {
    layer.fillText(this.text, this.x, this.y);
	}
};

