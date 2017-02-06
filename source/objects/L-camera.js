var L;
L.objects.Camera = function()
{
    //2D Settings
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.zoom = 1;


    //3D settings
    this.z = 0;
    this.yaw = 0;
    this.pitch = 0;
    this.focalLength = 1000;
};

L.objects.Camera.prototype.update = function(dt)
{

};

L.objects.Camera.prototype.followObject = function(targetObject)
{
    this.x = targetObject.x;
    this.y = targetObject.y;
};


L.objects.Camera.prototype.setXY = function(x,y)
{
  this.x = x;
  this.y = y;
};
L.objects.Camera.prototype.setXYZ = function(x,y,z)
{
    this.x = x;
    this.y = y;
    this.z = z;
};

L.objects.Camera.prototype.setViewAngle = function(angle)
{
    this.focalLength = L.system.width/angle;
};

L.objects.Camera.prototype.getViewAngle = function()
{
  return L.system.width/this.focalLength;
};