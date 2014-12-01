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
L.objects.Circle.prototype.radius = 20;
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
    var self = this;
    layer.arc(self.x, self.y, self.radius, 0, 2 * Math.PI);
    if (self.fillStyle !== "")
    {
	layer.fillStyle = self.fillStyle;
	layer.fill();
    }
    if (self.strokeStyle !== "" && self.lineWidth !== 0)
    {
	layer.strokeStyle = self.strokeStyle;
	layer.lineWidth = self.lineWidth;
	layer.stroke();
    }

};