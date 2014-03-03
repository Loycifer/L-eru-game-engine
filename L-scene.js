var L;
L.objects.Scene = function(name)
{
    L.scenes[name] = this;
    this.layers = [];

};

L.objects.Scene.prototype.update = function()
{
    this.layers.update();
};

L.objects.Scene.prototype.draw = function()
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

