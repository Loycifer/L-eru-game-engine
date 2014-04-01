var L;
L.objects.Textbox = function(text, x, y, width, height, alignment)
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

    this.color = "#000000";
    this.wrap = true;
    this.alignment = alignment || "left";

    this.width = 0;
    this.height = 0;

    this.bgcolor = "#000000";
    this.borderColor = "";
    this.borderWidth = 0;

    this.marginLeft = 5;
    this.marginTop = 5;
    this.marginRight = 5;
    this.marginBottom = 5;
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

	layer.beginPath();
	layer.fillStyle = this.bgcolor;
	layer.rect(this.x, this.y, this.width + this.marginLeft + this.marginRight, this.height + this.marginTop + this.marginBottom);
	layer.fill();
	if (this.boxOutlineWidth > 0)
	{
	    layer.strokeStyle = this.borderColor;
	    layer.lineWidth = this.borderWidth;
	    layer.stroke();
	}
	layer.fillStyle = this.color;
	layer.textBaseline = "bottom";
	layer.fillText(this.text, this.x + this.marginLeft, this.y + this.marginTop + this.fontSize);
    }
};

L.objects.Textbox.prototype.autoSize = function()
{
    L.system.bufferContext[0].font = this.fontSize + "px " + this.font;
    var metrics = L.system.bufferContext[0].measureText(this.text);
    this.width = metrics.width;
    this.height = this.fontSize;

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
};