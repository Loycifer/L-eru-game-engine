var output = document.getElementById("Output");
var combinedFiles = "";
function addFile(sources)
{
    var length = sources.length;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
	xmlhttp = new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function()
    {
	if (xmlhttp.readyState === 4 && xmlhttp.status === 200)
	{
	    //var response = xmlhttp.responseText.replace("var L;", "");
	    var response = xmlhttp.responseText;
	    combinedFiles += "<pre><code>" + response + "</code></pre>";
	    if (length > 1)
	    {
		sources.shift();

		addFile(sources);
	    } else {

		output.innerHTML = "// L (eru) Game Engine instant build compiled at " + new Date().toUTCString() + "\n" + combinedFiles;
		//var file = document.createElement('a');
		//file.setAttribute('href', 'data:application/octet-stream,' + encodeURIComponent("combinedFiles"));
		//file.setAttribute('download', "L-eru.combined.txt");
		// document.body.appendChild(file);
		//file.click();
		//document.body.removeChild(file);
	    }
	}
	else if (xmlhttp.status === 404)
	{
	    alert("File " + sources[0] + " could not be loaded.");
	}

    };
    xmlhttp.open("GET", sources[0] + ".js", true);
    xmlhttp.send();
}
files = ["L-preload", "L", "L-setup", "L-display", "L-sprite", "L-layer", "L-scene", "L-textbox", "L-transition",
    "L-keymap"];
addFile(files);
