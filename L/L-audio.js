var L;

L.system.checkAudio = function() // Checks for client-supported audio type
{
    var dummyAudio = document.createElement('audio');

    if (dummyAudio.canPlayType('audio/ogg'))
    {
	L.system.audioType = ".ogg";
	L.log("Using .ogg files");
    }
    else if (dummyAudio.canPlayType('audio/mp4'))
    {
	L.system.audioType = ".m4a";
	L.log("Using .m4a files");
    }
    else if (dummyAudio.canPlayType('audio/wav'))
    {
	L.system.audioType = ".wav";
	L.log("Using .wav files");
    }
    else
    {
	L.alert("Your browser doesn't support .wav, .ogg, or .m4a audio files.");
    }
};

L.system.checkAudio();
L.audio = {};
L.audio.context = {};

try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    L.audio.context = new AudioContext();
    L.audio.compressor = L.audio.context.createDynamicsCompressor();
    L.audio.compressor.connect(L.audio.context.destination);
    L.audio.masterGain = L.audio.context.createGain();
    L.audio.masterGain.connect(L.audio.compressor);
    L.audio.masterGain.gain.value = 1;
    L.audio.soundFX = L.audio.context.createGain();
    L.audio.soundFX.connect(L.audio.masterGain);

//mix.connect(compressor);


    setupWebAudio();

}
catch (e) {
    alert('Web Audio API is not supported in this browser');
}

function setupWebAudio() {
    L.load.audio = function(file, audioName)
    {
	L.system.expectedResources += 1;
	var request = new XMLHttpRequest();
	var name = (audioName === undefined) ? file.substr(0, file.lastIndexOf(".")) : audioName;
	request.open('GET', (L.system.resourcePath + L.system.soundPath + file), true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function() {

	    L.audio.context.decodeAudioData(request.response, function(audioBuffer) {

		L.sound[name] = audioBuffer;
		L.system.loadedResources += 1;
		L.log("Loaded audio file " + file);


	    }, (function() {
		L.alert("There was a problem loading " + file + ".");
	    }));
	};
	request.send();

    };

    L.objects.soundFX = function(audioBuffer)
    {
	this.buffer = audioBuffer;
	// tell the source which sound to play

    };

    L.objects.soundFX.prototype.play = function(gain, panX, panY, panZ)
    {
	var source = L.audio.context.createBufferSource();
	source.buffer = L.sound[this.buffer];

	var pannerNode = L.audio.context.createPanner();
	var gainNode = L.audio.context.createGain();
	pannerNode.connect(L.audio.soundFX);
	pannerNode.panningModel = "equalpower";
	pannerNode.setPosition(0, 0, 0);
	gainNode.connect(pannerNode);

	source.connect(gainNode);
	source.start(0);
	L.log("playing sound");

    };
}