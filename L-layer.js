var L;

L.objects.Layer = function(targetContext)
{
    this.sorted = true;
    this.sortBy = ["z"];
    this.sortOrder = [1];
    this.objects = [];
    this.targetContext = targetContext;
    this.layerAlpha = 1;
    this.isClickable = true;
};

L.objects.Layer.prototype.draw = function()
{
    this.autoDraw();
};

L.objects.Layer.prototype.autoDraw = function()
{
    this.objects.draw(this.targetContext);
};

L.objects.Layer.prototype.update = function()
{
    this.autoUpdate();
};

L.objects.Layer.prototype.autoUpdate = function()
{
    this.objects.mapQuick(function(object) {
	object.update();
    });
    if (this.sorted)
    {
	length = this.sortBy.length;
	for (var i=0;i<length;i++)
	this.objects.sortBy(this.sortBy[i], this.sortOrder[i]);
    }
};


L.objects.Layer.prototype.isClicked = function(mouseX, mouseY)
{

    if (this.isClickable)
    {
	this.objects.isClicked(mouseX, mouseY);
    }
};

L.objects.Layer.prototype.addObject = function(object)
{
    this.objects.push(object);
};

L.objects.Layer.prototype.addObjects = function(objects)
{
    var objectsLength = arguments.length;
    for (var i = 0; i < objectsLength; i++)
    {
	this.addObject(arguments[i]);
    }
};
