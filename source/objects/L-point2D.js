/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global L */
L.objects.Point2D = function(x,y)
{
    this.x = x;
    this.y = y;
};

L.objects.Point2D.prototype.distanceToPoint = function(otherPoint)
{
  var xd = this.x-otherPoint.x;
  var yd = this.y-otherPoint.y;
  return Math.sqrt(xd*xd+yd*yd);
};

L.objects.Point2D.prototype.closestPoint = function(point1,point2)
{

};