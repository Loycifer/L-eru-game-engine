var L;
L.objects.Scene = function(name)
{
    L.scenes[name] = this;
    this.layers = [new L.objects.Layer(L.system.bufferContext[0])];
    this.bgFill = "blueviolet";
    this.motionBlur = 1;
    this.keymap = {};

};

L.objects.Scene.prototype.update = function(dt)
{
    this.autoUpdate(dt);
};

L.objects.Scene.prototype.doKeyDown = function(event)
{
    this.keymap.doKeyDown(event);
};

L.objects.Scene.prototype.autoUpdate = function(dt)
{

    this.layers.update(dt);

};

L.objects.Scene.prototype.draw = function()
{
    this.autoDraw();
};

L.objects.Scene.prototype.autoDraw = function()
{
    L.system.bufferContext[0].fillStyle = this.bgFill;
    L.system.bufferContext[0].fillRect(0, 0, L.system.width, L.system.height);
    this.layers.draw();
    L.system.renderContext[0].globalAlpha = this.motionBlur;
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

L.objects.Scene.prototype.addObject = function(object)
{
    this.layers[0].addObject(object);
};

L.objects.Scene.prototype.addObjectToLayer = function(object, layer)
{
    this.layers[layer].addObject(object);
};

L.objects.Scene.prototype.isClicked = function(mouseX, mouseY)
{

    this.layers.isClicked(mouseX, mouseY);
};


L.objects.Scene.prototype.transition = {};

L.objects.Scene.prototype.transition.fadeToColor = function(nextScene, fadeOut, pause, fadeIn, color, callback)
{

    L.transitions.fadeToColor.play(L.system.currentScene, nextScene, fadeOut, pause, fadeIn, color, callback);
};

L.objects.Scene.prototype.transition.fadeToBlack = function(nextScene, fadeOut, pause, fadeIn, callback)
{

    L.transitions.fadeToColor.play(L.system.currentScene, nextScene, fadeOut, pause, fadeIn, "#000000", callback);
};

L.objects.Scene.prototype.transition.instant = function(nextScene, callback)
{

    L.transitions.instant.play(L.system.currentScene, nextScene, callback);
};