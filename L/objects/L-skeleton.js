//IN PROGRESS

var L;

L.objects.Bone = function(textureName, options) {
    L.objects.Sprite.call(this, textureName, options);
    this.inheritPosition = true;
    this.inheritAngle = true;
    this.joint = {
	x: 0,
	y: 0
    };
    this.relAngle = 0;
    this.children = [];


};
L.objects.Bone.prototype = new L.objects.Sprite;
L.objects.Bone.constructor = L.objects.Bone;

L.objects.Bone.prototype.draw = function(layer)
{
    this.autoDraw(layer);
};

L.objects.Bone.prototype.updateBone = function(dt)
{

    if (this.inheritPosition)
    {
	var parent = this.parent;
	var parentX = parent.x;
	var parentY = parent.y;
	var jointX = this.joint.x - parent.handle.x;
	var jointY = this.joint.y - parent.handle.y;
	if (parent.angle === 0)
	{
	    this.x = this.parent.x + this.joint.x - this.parent.handle.x;
	    this.y = this.parent.y + this.joint.y - this.parent.handle.y;
	}
	else
	{
	    var newPosition = Math.rotatePoint(jointX, jointY, this.parent.angle);
	    this.x = newPosition.x + parentX;
	    this.y = newPosition.y + parentY;
	}
    }
    if (this.inheritAngle)
    {
	this.angle = this.relAngle + parent.angle;

    }
    var numberOfChildren = this.children.length;
    for (var i = 0; i < numberOfChildren; i++)
    {
	this.children[i].updateBone(dt);
	this.children[i].update(dt);
    }
};





L.objects.Skeleton = function(textureName, options)
{
    L.objects.Sprite.call(this, textureName, options);


    this.children = [];
    this.bones = {};
    this.drawOrder = [this];

};

L.objects.Skeleton.prototype = new L.objects.Sprite;
L.objects.Skeleton.constructor = L.objects.Skeleton;

L.objects.Skeleton.prototype.handleClick = function(mouseX, mouseY)
{
    var numberOfBones = this.drawOrder.length;


    for (var i = numberOfBones - 1; i >= 0; i--)
    {
var currentBone = this.drawOrder[i];
var clickResult;
	if (this !== currentBone)

	{
	    clickResult = currentBone.handleClick(mouseX, mouseY);

	}
	else
	{
	    clickResult = L.objects.Sprite.prototype.handleClick.call(this.drawOrder[i], mouseX, mouseY);
	}
	if (clickResult)
	{
	    return true;
	}
    }
};
L.objects.Skeleton.prototype.addBone = function(textureName, boneName)
{

    var newBone = new L.objects.Bone(textureName);
    newBone.name = boneName;
    newBone.master = this;
    newBone.parent = this;
    this.children.push(newBone);
    this.bones[boneName] = newBone;
    this.drawOrder.push(newBone);
    return newBone;

};

L.objects.Bone.prototype.addBone = function(textureName, boneName)
{

    var newBone = new L.objects.Bone(textureName);
    newBone.name = boneName;
    newBone.master = this.master;
    newBone.parent = this;
    this.children.push(newBone);
    this.master.bones[boneName] = newBone;
    this.master.drawOrder.push(newBone);
    return newBone;

};

L.objects.Skeleton.prototype.draw = function(layer)
{
    var numberOfLimbs = this.drawOrder.length;
    for (var i = 0; i < numberOfLimbs; i++)
    {
	var currentSprite = this.drawOrder[i];
	if (this === currentSprite)
	{
	    this.autoDraw(layer);
	}
	else
	{
	    this.drawOrder[i].draw(layer);
	}
    }
};

L.objects.Skeleton.prototype.update = function(dt)
{
    this.updateBones(dt);
};

L.objects.Skeleton.prototype.updateBones = function(dt)
{
    var numberOfChildren = this.children.length;

    for (var i = 0; i < numberOfChildren; i++)
    {
	var currentBone = this.children[i];
	currentBone.updateBone(dt);
	currentBone.update(dt);

    }
};
