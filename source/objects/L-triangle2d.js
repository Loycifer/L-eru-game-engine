/* global L*/

L.objects.Triangle2D = function(verticesArray)
{
    this.x1 = verticesArray[0][0];
    this.x2 = verticesArray[1][0];
    this.x3 = verticesArray[2][0];

    this.y1 = verticesArray[0][1];
    this.y2 = verticesArray[1][1];
    this.y3 = verticesArray[2][1];

    this.stroke = true;
    this.lineWidth = 1;
    this.strokeStyle = "#FF0000";

    this.fill = false;
    this.fillStyle = "#FFFFFF";
};

L.objects.Triangle2D.prototype.draw = function(ctx)
{

    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.lineTo(this.x3, this.y3);
    ctx.closePath();
    if (this.stroke)
    {
	if (this.lineWidth !== ctx.lineWidth)
	{
	    ctx.lineWidth = this.lineWidth;
	}
	if (this.strokeStyle !== ctx.strokeStyle)
	{
	    ctx.strokeStyle = this.strokeStyle;
	}
	ctx.stroke();
    }

};

L.objects.Triangle2D.prototype.findIncenter = function()
{

};

L.objects.Triangle2D.prototype.growBy = function(distance, clampLimit)
{
    var side1 = Math.sqrt(Math.pow(this.x2 - this.x3, 2) + Math.pow(this.y2 - this.y3, 2));
    var side2 = Math.sqrt(Math.pow(this.x3 - this.x1, 2) + Math.pow(this.y3 - this.y1, 2));
    var side3 = Math.sqrt(Math.pow(this.x1 - this.x2, 2) + Math.pow(this.y1 - this.y2, 2));

    // var slope1 =

    var angle1 = Math.acos((side2 * side2 + side3 * side3 - side1 * side1) / (2 * side2 * side3));
    var angle2 = Math.acos((side3 * side3 + side1 * side1 - side2 * side2) / (2 * side3 * side1));
    var angle3 = Math.acos((side1 * side1 + side2 * side2 - side3 * side3) / (2 * side1 * side2));

    var incenterX = (this.x1 * side1 + this.x2 * side2 + this.x3 * side3) / (side1 + side2 + side3);
    var incenterY = (this.y1 * side1 + this.y2 * side2 + this.y3 * side3) / (side1 + side2 + side3);

    var distance1 = distance / Math.sin(angle1 / 2);
    var distance2 = distance / Math.sin(angle2 / 2);
    var distance3 = distance / Math.sin(angle3 / 2);

    var distanceToIC1 = Math.sqrt(Math.pow(this.x1 - incenterX, 2) + Math.pow(this.y1 - incenterY, 2));
    var distanceToIC2 = Math.sqrt(Math.pow(this.x2 - incenterX, 2) + Math.pow(this.y2 - incenterY, 2));
    var distanceToIC3 = Math.sqrt(Math.pow(this.x3 - incenterX, 2) + Math.pow(this.y3 - incenterY, 2));

    var ratio1 = distance1 / distanceToIC1;
    var ratio2 = distance2 / distanceToIC2;
    var ratio3 = distance3 / distanceToIC3;

    if (clampLimit === undefined)
    {
	this.x1 = this.x1 + ((this.x1 - incenterX) * ratio1);
	this.y1 = this.y1 + ((this.y1 - incenterY) * ratio1);

	this.x2 = this.x2 + ((this.x2 - incenterX) * ratio2);
	this.y2 = this.y2 + ((this.y2 - incenterY) * ratio2);

	this.x3 = this.x3 + ((this.x3 - incenterX) * ratio3);
	this.y3 = this.y3 + ((this.y3 - incenterY) * ratio3);
    } else {
	this.x1 = this.x1 + ((this.x1 - incenterX) * ratio1).clamp(-clampLimit, clampLimit);
	this.y1 = this.y1 + ((this.y1 - incenterY) * ratio1).clamp(-clampLimit, clampLimit);

	this.x2 = this.x2 + ((this.x2 - incenterX) * ratio2).clamp(-clampLimit, clampLimit);
	this.y2 = this.y2 + ((this.y2 - incenterY) * ratio2).clamp(-clampLimit, clampLimit);

	this.x3 = this.x3 + ((this.x3 - incenterX) * ratio3).clamp(-clampLimit, clampLimit);
	this.y3 = this.y3 + ((this.y3 - incenterY) * ratio3).clamp(-clampLimit, clampLimit);
    }

};