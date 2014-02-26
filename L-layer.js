var L;

L.objects.Layer = function(targetContext)
{
this.sorted = false;
this.sortBy = "x";
this.objects = [];
this.targetContext = targetContext;
this.layerAlpha = 1;
this.isClickable = true;
};


L.objects.Layer.prototype.draw = function()
{
  this.objects.draw(this.targetContext);
};


L.objects.Layer.prototype.update = function()
{
    this.objects.mapQuick(function(object){object.update();});
    if (this.sorted)
    {
	var sortBy = this.sortBy;
	this.objects.sortBy(sortBy);
    }
};


L.objects.Layer.prototype.isClicked = function(mouseX,mouseY)
{

    if (this.isClickable)
    {
	this.objects.isClicked(mouseX,mouseY);
    }
};

L.objects.Layer.prototype.addObject = function(object)
{
    this.objects.push(object);
};
