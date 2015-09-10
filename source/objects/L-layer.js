var L;

L.objects.Layer = function(name)
{
    this.name = name;
    this.sorted = false;
    this.sortBy = ["z"];
    this.sortOrder = [1];
    this.objects = [];
    this.targetContext = L.system.bufferContext[0];
    this.layerAlpha = 1;
    this.isClickable = true;
    this.scrollRateX = 1;
    this.scrollRateY = 1;
    this.visible = true;
    this.updating = true;
};



L.objects.Layer.prototype.autoDraw = function(camera)
{
    //this.objects.draw(this.targetContext,camera);
if (!this.visible)
{
    return;
}
    var objectsToDraw = this.objects;
    var length = objectsToDraw.length;
    var currentObject={};
    for (var i = 0; i < length; i++)
    {
	currentObject=objectsToDraw[i];
	if (currentObject && currentObject.draw)
	{
	    currentObject.draw(this.targetContext,camera);
	}
    }

};

L.objects.Layer.prototype.draw = L.objects.Layer.prototype.autoDraw;



L.objects.Layer.prototype.autoUpdate = function(dt)
{
    if (!this.updating)
    {
	return;
    }
    this.objects.update(dt);

    if (this.sorted)
    {
	var length = this.sortBy.length;
	for (var i = 0; i < length; i++)
	{
	    this.objects.sortBy(this.sortBy[i], this.sortOrder[i]);
	}
    }

};

L.objects.Layer.prototype.update = L.objects.Layer.prototype.autoUpdate;


L.objects.Layer.prototype.handleClick = function(mouseX, mouseY, e)
{

    if (this.isClickable)
    {
	this.objects.handleClick(mouseX, mouseY, e);
    }
};

L.objects.Layer.prototype.addObject = function(object)
{
    this.objects.push(object);
};

L.objects.Layer.prototype.addObjects = function()
{
    var objectsLength = arguments.length;
    for (var i = 0; i < objectsLength; i++)
    {
	this.addObject(arguments[i]);
    }
};

