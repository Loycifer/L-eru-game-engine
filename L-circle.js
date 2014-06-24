var L;
L.objects.Circle = function()
{

};

L.objects.Circle.prototype.x = 0;
L.objects.Circle.prototype.y = 0;
L.objects.Circle.prototype.handle = {
    x: 0,
    y: 0
};
L.objects.Circle.prototype.r = 20;
L.objects.Circle.prototype.alpha = 1;

L.objects.Circle.prototype.fillStyle = "#FFFFFF";
L.objects.Circle.prototype.lineWidth = "3";
L.objects.Circle.prototype.strokeStyle = "#FFFFFF";

L.objects.Circle.prototype.draw = function(layer)
{
    this.autoDraw(layer);
};

L.objects.Circle.prototype.autoDraw = function(layer)
{
    layer.beginPath();
    layer.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    if (this.fillStyle !== "")
    {
	layer.fillStyle = this.fillStyle;
	layer.fill();
    }
    if (this.strokeStyle !== "" && this.lineWidth !== 0)
    {
	layer.strokeStyle = this.strokeStyle;
	layer.lineWidth = this.lineWidth;
	layer.stroke();
    }

};