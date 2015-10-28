/*
 * RayCast Window Object
 *
 * Can use generic camera
 *
 * follows standard raytrace algorithms
 * however, stores each column in array beforw drawing, in order to sort z order and display 3d sprites
 * need to learn floor rendering
 *
 * checks if walls are transparent, in order to
 *
 *
 * need to figure out good algorithm for floor
 */

/* global L */


L.objects.RayCastWindow = function()
{
    this.x = 0;
    this.y = 0;
    this.width = 300;
    this.height = 300;

    this.relativeAngles = [];


    this.resolutionRatio = 1;
    this.range = 10;
    this.viewAngle = Math.PI/2;
    this.camera = new L.objects.Camera();
    this.setHorizontalResolution(300);
    this.arrayOfRays = [];

    this.map = [[1, 0, 1, 0, 1, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 1, 0, 1, 0, 1, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 1, 0, 1, 0, 1, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 1, 0, 1, 0, 1, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 1, 0, 1, 0, 1, 0, 1]];


    //debugging vars
    this.camera.x = -1;
    this.camera.y = 1.5;
    this.camera.angle = 0;
    this.frameCount = 0;

};

L.objects.RayCastWindow.prototype.setHorizontalResolution = function(horizontalResolution)
{
    this.horizontalResolution = horizontalResolution;
    var leftAngle = this.viewAngle / 2;
    //tan angle = opp/hyp
    var maxDistance = -Math.tan(leftAngle) / 2;
    alert(maxDistance);
    for (var i = 0; i < horizontalResolution; i++)
    {
	var currentAngle = Math.atan2(-maxDistance*2*i/ horizontalResolution + maxDistance, 1);
	this.relativeAngles.push(currentAngle);
    }
};

L.objects.RayCastWindow.prototype.update = function()
{
    this.frameCount += 1;
    var centreAngle = this.camera.angle;
    var x = this.camera.x;
    var y = this.camera.y;
    var columns = this.horizontalResolution;

    for (var i = 0; i < columns; i++)
    {
	var relativeAngle = this.relativeAngles[i];
	var angle = centreAngle + relativeAngle;
	// var slopeX = Math.sin(angle);
	// var slopeY = Math.cos(angle);

	var slope = Math.tan(angle);

	//y = mx +c
	//c = y-mx

	var yIntersect = y - (x * slope);

	var startY = Math.ceil(y);
	var endY = startY + this.range;

	for (var yCheck = startY; yCheck < endY; yCheck++)
	{

	}

	var startX = Math.floor(x);
	var endX = startX + this.range;

	for (var xCheck = startX; xCheck < endX; xCheck++)
	{

	    var currentY = slope * xCheck + yIntersect;
	    if (currentY - y > this.range || this.map[Math.floor(currentY)] === undefined)
	    {
		break;
	    }

	    var blockVal = this.map[Math.floor(currentY)][xCheck];
	    if (blockVal === 1)
	    {
//alert(2);
		var yDist = currentY - y;
		var xDist = xCheck - x;
		var distance = Math.sqrt(xDist * xDist + yDist * yDist);
		this.arrayOfRays[i] = {
		    frame: this.frameCount,
		    distance: distance,
		    adjustedDistance: distance * Math.cos(relativeAngle)
		};

		break;

	    }

	}
    }
};

L.objects.RayCastWindow.prototype.draw = function(ctx)
{
    var arrayLength = this.arrayOfRays.length;
    var lineWidth = this.width / this.horizontalResolution;
    var currentRay;
    for (var i = 0; i < arrayLength; i++)

    {
	if (this.arrayOfRays[i] !== undefined && this.arrayOfRays[i].frame === this.frameCount)
	{
	    var currentRay = this.arrayOfRays[i];
	    var distance = currentRay.distance;
	    var height = this.height / 2 * 1 / currentRay.adjustedDistance;
	    var light = ((1 / (distance + 1) * 5) * 255) | 0;
	    var fillColor = "rgb(" + light + ",255,255)";
	    ctx.fillStyle = fillColor;
	    ctx.fillRect(i * lineWidth, 150 - (height / 2), lineWidth, height);
	}
    }
};

