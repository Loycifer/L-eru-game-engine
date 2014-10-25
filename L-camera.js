var L;
L.objects.Camera = function()
{
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.zoom = 1;
};

L.objects.Camera.update = function(dt)
{

};

L.objects.Camera.followObject = function(targetObject)
{
    this.x = targetObject.x;
    this.y = targetObject.y;
};
