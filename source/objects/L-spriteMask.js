/* global L */


L.objects.SpriteMask = function (textureName,red,green,blue,alpha,width,height)
{

    this.red = red;
    this.green = green;
    this.blue = blue;
    var texture = this.sourceTexture = L.textures[textureName];
    var targetWidth = this.width = (width === undefined)?texture.width:width;
    var targetHeight = this.height = (height === undefined)?texture.height:height;

    if ((targetWidth === 0) || (targetHeight === 0))
    {
	alert("Texture '" + texture + "' does not seem to have any dimensions.");
    }

    var maskCanvas = this.texture = document.createElement("canvas");
    maskCanvas.width = targetWidth;
    maskCanvas.height = targetHeight;
    var ctx = this.ctx = maskCanvas.getContext("2d");
    ctx.drawImage(texture,0,0);
      this.imageData = this.ctx.getImageData(0,0,targetWidth,targetHeight);
    this.setColor(red,green,blue,alpha);


};

L.objects.SpriteMask.prototype.saveAs = function(textureName)
{
    L.textures[textureName] = this.texture;
};

L.objects.SpriteMask.prototype.setColor = function(red,green,blue,alpha)
{
var width = this.width;
var height = this.height;
this.red = red;
this.green = green;
this.blue = blue;
    var imageData = this.imageData;//this.ctx.getImageData(0,0,width,height);
    var dataLength = imageData.data.length;
    for (var i = 0; i < dataLength; i+=4)
    {
	imageData.data[i] = red;
	imageData.data[i+1] = green;
	imageData.data[i+2] = blue;
    }
    this.ctx.clearRect(-1,-1,width+1,height+1);

   this.ctx.putImageData(imageData,0,0);
};