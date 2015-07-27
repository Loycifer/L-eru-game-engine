/* global L */


L.objects.SpriteMask = function (textureName,red,green,blue,alpha,width,height)
{
    var texture = L.textures[textureName];
    var targetWidth = (width === undefined)?texture.width:width;
    var targetHeight = (height === undefined)?texture.height:height;

    if ((targetWidth === 0) || (targetHeight === 0))
    {
	alert("Texture '" + texture + "' does not seem to have any dimensions.");
    }

    var maskCanvas = document.createElement("canvas");
    maskCanvas.width = targetWidth;
    maskCanvas.height = targetHeight;
    var ctx = maskCanvas.getContext("2d");
    ctx.drawImage(texture,0,0);
    var imageData = ctx.getImageData(0,0,targetWidth,targetHeight);
    var dataLength = imageData.data.length;
    for (var i = 0; i < dataLength; i+=4)
    {
	imageData.data[i] = red;
	imageData.data[i+1] = green;
	imageData.data[i+2] = blue;
    }
    ctx.clearRect(-1,-1,targetWidth+1,targetHeight+1);

   ctx.putImageData(imageData,0,0);
    return maskCanvas;


};