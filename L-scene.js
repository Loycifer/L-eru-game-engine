var L;
L.objects.Scene = function(name)
{
    L.scenes[name] = this;
    this.layers = [];

};

L.objects.Scene.prototype.update = function()
{
    this.autoUpdate();
};

L.objects.Scene.prototype.autoUpdate = function()
{
    
    this.layers.update();
   
};

L.objects.Scene.prototype.draw = function()
{
    this.autoDraw();
};

L.objects.Scene.prototype.autoDraw = function()
{
    	L.system.bufferContext[0].fillStyle = "#000000";
	L.system.bufferContext[0].fillRect(0, 0, L.system.width, L.system.height);
    this.layers.draw();
    	L.system.renderContext[0].globalAlpha = 0.5;
	L.system.renderContext[0].drawImage(L.system.bufferCanvas[0], 0, 0, L.system.width, L.system.height);
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

L.objects.Scene.prototype.fadeToColor = function(nextScene, fadeOut, pause, fadeIn, color, callback)
{
    L.transitions.fadeToColor.play(this, nextScene, fadeOut, pause, fadeIn, color, callback);
};