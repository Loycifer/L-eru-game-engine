var L;

var Bone = function(textureName, options) {
    L.objects.Sprite.call(this, textureName, options);
    this.ingeritPosition = true;
    this.inheritAngle = true;
    this.joint = {
	x: 0,
	y: 0
    };


};
Bone.prototype = new L.objects.Sprite;
Bone.constructor = Bone;








L.objects.Skeleton = function(textureName, options)
{
    L.objects.Sprite.call(this, textureName, options);


    this.bones = {};
    this.allBones = {};

};

L.objects.Skeleton.prototype = new L.objects.Sprite;
L.objects.Skeleton.constructor = L.objects.Skeleton;

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

