/* global L */

/**
 * Creates a new Scene object.  The scene comes with an empty keymap object and one layer called "background"
 * @constructor
 * @param {string} name - The name of the scene
 * @return {L.objects.Scene}
 */
L.objects.Scene = function(name)
{

    this.name = name;

    L.scenes[name] = this;
    this.layers = {
	"background": new L.objects.Layer("background")
    };
    this.layerOrder = ["background"];
    this.bgFill = "blueviolet";
    this.motionBlur = 1;
    this.keymap = new L.keyboard.Keymap();

    this.activeLayer = {};
    this.camera = {
	x: 0,
	y: 0,
	angle: 0,
	zoom: 1
    };
};

L.objects.Scene.prototype.doKeyDown = function(event)
{
    if (this.keymap.doKeyDown !== undefined)
    {
	this.keymap.doKeyDown(event);
    }
};

L.objects.Scene.prototype.doKeyUp = function(event)
{
    if (this.keymap.doKeyUp !== undefined)
    {
	this.keymap.doKeyUp(event);
    }
};
/**
 * @method
 * @param {float} dt - Delta time
 * @returns {L.objects.Scene} Scene
 */
L.objects.Scene.prototype.autoUpdate = function(dt)
{
    var layerOrder = this.layerOrder;
    var length = layerOrder.length;
    for (var i = 0; i < length; i++)

    {
	var currentLayer = this.layers[layerOrder[i]];
	this.activeLayer = currentLayer;
	currentLayer.update(dt);
    }
    return this;
};
L.objects.Scene.prototype.update = L.objects.Scene.prototype.autoUpdate;

L.objects.Scene.prototype.autoDraw = function()
{
    var system = L.system;
    var layer = system.bufferContext[0];
    var renderContext = system.renderContext[0];
    var width = system.width;
    var height = system.height;
    layer.fillStyle = this.bgFill;
    layer.fillRect(0, 0, width, height);
    var layerOrder = this.layerOrder;
    var length = layerOrder.length;
    for (var i = 0; i < length; i++)
    {
	var currentLayer = this.layers[layerOrder[i]];
	this.activeLayer = currentLayer;
	currentLayer.draw();
    }
    layer.globalAlpha = 1;
    renderContext.globalAlpha = this.motionBlur;
    renderContext.drawImage(system.bufferCanvas[0], 0, 0, width, height);
};

L.objects.Scene.prototype.draw = L.objects.Scene.prototype.autoDraw;

L.objects.Scene.prototype.newLayer = function(name)
{
    var newLayer = new L.objects.Layer(name);
    this.layers[name] = newLayer;
    this.layerOrder.push(name);
    return newLayer;

};

L.objects.Scene.prototype.addLayer = L.objects.Scene.prototype.newLayer;

L.objects.Scene.prototype.addLayerObject = function(layer)
{

    this.layers[layer.name] = layer;
    this.layerOrder.push(layer.name);

};

/**
 *
 * @param {Object} object
 * @param {string} layerName
 * @returns {L.objects.Layer}
 */
L.objects.Scene.prototype.addObjectToLayer = function(object, layerName)
{
    this.layers[layerName].addObject(object);
    return this;
};

L.objects.Scene.prototype.handleClick = function(mouseX, mouseY, e)
{
    var layerOrder = this.layerOrder;
    var length = layerOrder.length;
    for (var i = 0; i < length; i++)
    {
	var currentLayer = this.layers[layerOrder[i]];
	this.activeLayer = currentLayer;
	currentLayer.handleClick(mouseX, mouseY, e);
    }
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

/**
 * Instructs the engine to switch to this scene before the next frame is rendered
 * @method
 * @returns {L.objects.Scene}
 */
L.objects.Scene.prototype.setScene = function()
{
    var system = L.system;
    system.previousScene = system.currentScene;
    system.nextScene = this;
    return this;
};