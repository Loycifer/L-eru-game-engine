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
L.objects.Ray2D = function(xOrigin, yOrigin, angle, range)

{
    this.xOrigin = xOrigin;
    this.yOrigin = yOrigin;
    this.range = range;
    this.slopeX = 0;
    this.slopeY = 0;
    this.yIntercept = 0;

    this.setAngle(angle);

    this.currentX = xOrigin;
    this.currentY = yOrigin;

};

L.objects.Ray2D.prototype.setAngle = function(angle)
{
    //y = mx+c

    this.slopeX = Math.cos(-angle);
    this.slopeY = Math.sin(-angle);
    //	this.slope = this.sin / this.cos;
    this.slope = Math.tan(-angle);
    this.yIntercept = this.yOrigin - (this.xOrigin * this.slope);
};

L.objects.Ray2D.prototype.moveOrigin = function(x, y, angle)
{
    this.xOrigin = this.currentX = x;
    this.yOrigin = this.currentY = y;

    this.setAngle(angle);

};

L.objects.Ray2D.prototype.getYFromX = function(x)
{
    return this.slope * x + this.yIntercept;
};

L.objects.Ray2D.prototype.getXFromY = function(y)
{
    return (y - this.yIntercept) / this.slope;
};
L.objects.Ray2D.prototype.inspectPoint = function(x, y, xPositive, yPositive, vertical, map, arrayOfRays, rayNum)
{
    if (x < 0 || y < 0)
    {
	return false;
    }
    var xGrid = x | 0 - (xPositive && !vertical) ? 0 : 1;
    var yGrid = y | 0;
    if (map[yGrid]
    && map[yGrid][xGrid]
    && map[yGrid][xGrid] === 1)
    {
	var xDist = x - this.xOrigin;
	var yDist = y - this.yOrigin;
	var distance = Math.sqrt(xDist * xDist + yDist * yDist);
	if (!arrayOfRays[rayNum] || arrayOfRays[rayNum].distance > distance)
	{
	    arrayOfRays[rayNum] = {
		frame: this.frameCount,
		distance: distance,
		adjustedDistance: distance * Math.cos(this.angle),
		x: x,
		y: y
	    };
	}
    }

};
L.objects.Ray2D.prototype.findNextIntersection = function(map, range, arrayOfRays, rayNum)
{
    this.xPositive = (this.slopeX >= 0) ? true : false;
    this.yPositive = (this.slopeY >= 0) ? true : false;
    this.resolved = false;


    while (!this.resolved)
    {
	if (Math.abs(this.currentX - this.xOrigin) > range || Math.abs(this.currentY - this.yOrigin) > range)
	{
	    this.resolved = true;
	    break;
	}

	if (this.xPositive)
	{
	    if (this.currentX < 0)
	    {
		this.currentX = -1;
	    }
	    this.nextVertX = (this.currentX + 1) | 0;
	} else
	{
	    if (this.currentX < 0)
	    {
		return false;
	    }
	    this.nextVertX = ((this.currentX | 0) === this.currentX) ? this.currentX - 1 : (this.currentX | 0);
	}
	this.nextVertY = this.getYFromX(this.nextVertX);

	if (this.yPositive)
	{
	    if (this.currentY < 0)
	    {
		this.currentY = -1;
	    }
	    this.nextHorY = (this.currentY + 1) | 0;
	} else
	{
	    if (this.currentY < 0)
	    {
		return false;
	    }
	    this.nextHorY = ((this.currentY | 0) === this.currentY) ? this.currentY - 1 : (this.currentY | 0);
	}
	this.nextHorX = this.getXFromY(this.nextHorY);

	this.dVertX = this.xOrigin - this.nextVertX;
	this.dVertY = this.yOrigin - this.nextVertY;
	this.dHorX = this.xOrigin - this.nextHorX;
	this.dHorY = this.yOrigin - this.nextHorY;

	if (this.dHorX * this.dHorX + this.dHorY * this.dHorY >= this.dVertX * this.dVertX + this.dVertY * this.dVertY)

	{
	    this.currentX = this.nextVertX;
	    this.currentY = this.nextVertY;
	    this.vertical = true;
	} else
	{
	    this.currentX = this.nextHorX;
	    this.currentY = this.nextHorY;
	    this.vertical = false;
	}




	if (this.currentY < 0 || this.currentX < 0)
	{
	    //this.resolved=true;
	    continue;
	}

	this.gridX = (!this.xPositive && this.vertical) ? (this.currentX - 1) | 0 : this.currentX | 0;
	this.gridY = (!this.yPositive && !this.vertical) ? (this.currentY - 1) | 0 : this.currentY | 0;

	if (map.grid[this.gridY]
	&& map.grid[this.gridY][this.gridX]
	&& map.grid[this.gridY][this.gridX] !== 0)
	{
	    this.resolved = true;
	    return true;
	}


    }
    return false;
};




L.objects.RayCastWindow = function(useBufferedCanvas)
{
    this.buffer = false;
    this.bufferContext = false;
    if (useBufferedCanvas)
    {
	this.buffer = document.createElement('canvas');
	this.bufferContext = this.buffer.getContext('2d');
    }
    this.x = 0;
    this.y = 0;
    this.width = 600;
    this.height = 300;

    this.relativeAngles = [];


    this.resolutionRatio = 1;
    this.range = 10;
    this.viewAngle = Math.PI / 1.5;
    this.camera = new L.objects.Camera();
    this.setHorizontalResolution(600);
    this.arrayOfRays = [];

    this.rayObject = new L.objects.Ray2D(0, 0, 0);

    this.map = {};
    this.map.type = "simple";
    this.map.legend = {1:"#ffffff"};
    this.map.grid =[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
	[1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
	[1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];


    //debugging vars
    this.camera.x = 3.5;
    this.camera.y = 4.5;
    this.camera.angle = 0;
    this.frameCount = 0;

};

L.objects.RayCastWindow.prototype.setResolution = function(xRes, yRes)
{
    this.setHorizontalResolution(xRes);
    if (this.buffer)
    {
	this.buffer.width = xRes;
    }
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
	var currentAngle = Math.atan2(-maxDistance * 2 * i / horizontalResolution + maxDistance, 1);
	this.relativeAngles.push(currentAngle);
    }
};

L.objects.RayCastWindow.prototype.update = function(dt)
{



    this.frameCount += 1;
    var centreAngle = this.camera.angle;
    var x = this.camera.x;
    var y = this.camera.y;
    var columns = this.horizontalResolution;
    //this.camera.angle += .2 * dt;

    for (var i = 0; i < columns; i++)
    {
	var relativeAngle = this.relativeAngles[i];
	var angle = centreAngle - relativeAngle;
	this.rayObject.moveOrigin(x, y, angle);


	if (this.rayObject.findNextIntersection(this.map, 20, this.arrayOfRays, i))
	{
	    var xDist = x - this.rayObject.currentX;
	    var yDist = y - this.rayObject.currentY;
	    var distance = Math.sqrt(xDist * xDist + yDist * yDist);
	    this.arrayOfRays[i] = {
		frame: this.frameCount,
		distance: distance,
		adjustedDistance: distance * Math.cos(relativeAngle),
		x: this.rayObject.currentX,
		y: this.rayObject.currentY
	    };
	} else
	{
	    this.arrayOfRays[i] = 0;

	}



	/**
	 for (var xCheck = startX; xCheck < endX; (directionX > 0)?xCheck++:xCheck--)
	 {
	 /** if (x > xCheck)
	 {
	 continue;
	 }

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
	 if (yDist <= 0 !== directionY <= 0)
	 {
	 continue;
	 }
	 var xDist = xCheck - x;
	 if (xDist <= 0 !== directionX <= 0)
	 {
	 continue;
	 }
	 var distance = Math.sqrt(xDist * xDist + yDist * yDist);
	 this.arrayOfRays[i] = {
	 frame: this.frameCount,
	 distance: distance,
	 adjustedDistance: distance * Math.cos(relativeAngle)
	 };

	 break;

	 }
	 )
	 **/

    }
};
L.objects.RayCastWindow.prototype.drawDebugMap = function(ctx, xPos, yPos, widht, height, scale)
{
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(xPos, yPos, this.map.grid[0].length * scale, this.map.grid.length * scale);
    for (var yCoords = 0; yCoords < this.map.grid.length; yCoords++)
	for (var xCoords = 0; xCoords < this.map.grid[0].length; xCoords++)
	{
	    if (this.map.grid[yCoords][xCoords] === 1)
	    {
		ctx.fillStyle = "#000000";
		ctx.fillRect(xCoords * scale, yCoords * scale, scale, scale);
	    }
	}

    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(this.camera.x * scale, this.camera.y * scale, 2.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    var arrayLength = this.arrayOfRays.length;
    ctx.strokeStyle = "#00FF00";
    for (var i = 0; i < arrayLength; i++)

    {
	if (this.arrayOfRays[i] !== undefined && this.arrayOfRays[i].frame === this.frameCount)
	{
	    var currentRay = this.arrayOfRays[i];
	    var currentAngle = this.camera.angle - this.relativeAngles[i];
	    var distance = currentRay.distance;
	    ctx.beginPath();
	    ctx.moveTo(this.camera.x * scale, this.camera.y * scale);
	    ctx.lineTo(currentRay.x * scale, currentRay.y * scale);
	    ctx.closePath();
	    ctx.stroke();

	}
    }
};
L.objects.RayCastWindow.prototype.draw = function(ctx)
{
    ctx.fillStyle = "#003366";
    ctx.fillRect(0, 0, this.width, this.height / 2);
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
	    var light = ((1 / (distance + 1) * 2) * 255) | 0;
	    var fillColor = "rgb(" + light + "," + light + "," + light + ")";
	    ctx.fillStyle = fillColor;
	    ctx.fillRect(i * lineWidth, 150 - (height / 2), lineWidth, height);
	}
    }
    this.drawDebugMap(ctx, 0, 0, 0, 0, 10);
    /**
     ctx.fillStyle = "#ffffff";
     ctx.fillRect(0, 0, this.map[0].length * 10, this.map.length * 10);
     for (var yCoords = 0; yCoords < this.map.length; yCoords++)
     for (var xCoords = 0; xCoords < this.map[0].length; xCoords++)
     {
     if (this.map[yCoords][xCoords] === 1)
     {
     ctx.fillStyle = "#000000";
     ctx.fillRect(xCoords * 10, yCoords * 10, 10, 10);
     }
     }

     ctx.fillStyle = "#FF0000";
     ctx.beginPath();
     ctx.arc(this.camera.x * 10, this.camera.y * 10, 2.5, 0, 2 * Math.PI);
     ctx.fill();
     ctx.closePath();

     ctx.strokeStyle = "#00FF00";
     for (var i = 0; i < arrayLength; i++)

     {
     if (this.arrayOfRays[i] !== undefined && this.arrayOfRays[i].frame === this.frameCount)
     {
     var currentRay = this.arrayOfRays[i];
     var currentAngle = this.camera.angle - this.relativeAngles[i];
     var distance = currentRay.distance;
     ctx.beginPath();
     ctx.moveTo(this.camera.x * 10, this.camera.y * 10);
     ctx.lineTo(currentRay.x * 10, currentRay.y * 10);
     ctx.closePath();
     ctx.stroke();

     }
     }**/

};

