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
	if (this.parent.angle === 0)
	{
	    this.x = this.parent.x + this.joint.x;
	    this.y = this.parent.y + this.joint.y;
	}
	else
	{
	    var parentX = this.parent.x;
	    var parentY = this.parent.y;
	    var jointX = this.joint.x;
	    var jointY = this.joint.y;
	    var newPosition = Math.rotatePoint(jointX, jointY, this.parent.angle);
	    this.x = newPosition.x + parentX;
	    this.y = newPosition.y + parentY;
	}
    }
    if (this.inheritAngle)
    {
	this.angle = this.relAngle + this.parent.angle;

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

	if (this !== this.drawOrder[i])
	{
	    var clickResult = this.drawOrder[i].handleClick(mouseX, mouseY);

	}
	else
	{
	    var clickResult = L.objects.Sprite.prototype.handleClick.call(this.drawOrder[i], mouseX, mouseY);
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
	this.children[i].updateBone(dt);
	this.children[i].update(dt);

    }
};

/*
 L.objects.Skeleton.prototype.getBone = function(name)
 {
 return this.allBones[name];
 };

 L.objects.Skeleton.prototype.addBone = function(name, sprite)
 {
 var newBone = new L.objects.Bone(name, sprite, this, this);
 this.bones[name] = newBone;
 this.allBones[name] = newBone;
 return newBone;
 };

 L.objects.Skeleton.prototype.draw = function(layer)
 {
 var bones = this.bones;
 for (var bone in bones)
 {
 //if (this.bones.hasOwnProperty(bone))
 //{

 bones[bone].draw(layer);
 //}
 }
 };

 L.objects.Skeleton.prototype.update = function(dt)
 {
 this.updateBones(dt);
 };

 L.objects.Skeleton.prototype.updateBones = function(dt)
 {
 var bones = this.bones;
 for (var bone in bones)
 {
 //if (this.bones.hasOwnProperty(bone))
 //{

 bones[bone].update(dt);
 //}
 }
 };



 L.objects.Bone = function(name, sprite, parent, skeleton)
 {
 this.x = 0;
 this.y = 0;
 this.jointX = 0;
 this.jointY = 0;
 this.angle = 0;
 this.realAngle = 0;

 this.depth = 0;
 this.name = name;
 this.sprite = sprite;
 this.parent = parent;
 this.skeleton = skeleton;
 this.bones = {};

 inheritPosition = true;
 inheritAngle = true;
 };
 L.objects.Bone.prototype = new L.objects.Sprite;
 L.objects.Bone.prototype.addBone = function(name, sprite)
 {
 var newBone = new L.objects.Bone(name, sprite, this, this.skeleton);
 this.bones[name] = newBone;
 this.skeleton.allBones[name] = newBone;
 };

 L.objects.Bone.prototype.update = function(dt)
 {
 var self = this;
 var parent = self.parent;

 var parentAngle = parent.realAngle;


 self.sprite.angle = self.realAngle = parentAngle + self.angle;

 this.x = this.parent.x + this.jointX;
 this.y = this.parent.y + this.jointY;
 if (parentAngle !== 0)
 {
 var transformX = this.x - parent.x;
 var transformY = this.y - parent.y;
 var newX = transformX * Math.cos(-parentAngle) - transformY * Math.sin(-parentAngle);
 var newY = transformX * Math.sin(-parentAngle) + transformY * Math.cos(-parentAngle);
 this.x = newX + parent.x;
 this.y = newY + parent.y;
 }
 this.sprite.x = this.x;
 this.sprite.y = this.y;




 var bones = this.bones;
 for (var bone in bones)
 {
 //if (this.bones.hasOwnProperty(bone))
 //{
 bones[bone].update(dt);
 //}
 }

 }
 ;

 L.objects.Bone.prototype.draw = function(layer)
 {
 this.sprite.draw(layer);
 //var boneStack = []; Use for implementing draw order in skeletons
 var bones = this.bones;
 for (var bone in bones)
 {
 //if (this.bones.hasOwnProperty(bone))
 //{
 bones[bone].draw(layer);
 //}
 }
 };

 */