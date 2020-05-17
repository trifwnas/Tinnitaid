/* 
Developed by Tryfon Tzanetis
    trif.tz@gmail.com
	    	 ____
	    	(_  _)
	    	  )(
	     	 (__)

************************************************************************          
StopTinnitus app intends to help tinninuts patient get rid of the noise. Please consult a doctor before using the app.
The creating team of the app does not hold any responsibility on how the app is used. By using the app you accept this policy statement.

    Copyright (C) 2019 Tryfon Tzanetis

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

For the complete license, please refer here: http://tafhub.com/labs/stoptinnitus/LICENSE.txt
************************************************************************
 */

//...................................................... live working
// *** NOISE GENERATOR SCRIPT ***

// Create Web Audio API context | Temp workaround until AudioContext is standardized
const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
numSeconds = 3600;
sampleRate = 32000;
bufferSize = numSeconds * sampleRate;

var whiteNoiseNode = context.createBufferSource(),
  buffer = context.createBuffer(1, bufferSize, sampleRate), // context.sampleRate
  data = buffer.getChannelData(0);
for (var i = 0; i < bufferSize; i++) {
  data[i] = Math.random() * 2 - 1;
}
whiteNoiseNode.buffer = buffer;
whiteNoiseNode.loop = true;

var connected = false;

// Volume
var gainNode = context.createGain();
gainNode.gain.value = 0.2; // 20 %
gainNode.connect(context.destination);

var playStopWhiteNoise = function() {
  if (!connected) {
    whiteNoiseNode.connect(gainNode);

    if (iOS) {
      alert(
        "Sound started. Un-mute your device or select volume if you cannot hear anything."
      );
      webAudioTouchUnlock(context).then(
        function(unlocked) {
          if (unlocked) {
            // AudioContext was unlocked from an explicit user action,
            // sound should start playing now
            whiteNoiseNode.start(context.currentTime);
          } else {
            alert("Restart is needed");
            // window.location = 'http://127.0.0.1:8881/therapy.html'; // testing
            window.location = "https://www.tafhub.com/labs/stoptinnitus/therapy.html";
          }
        },
        function(reason) {
          console.error(reason);
        }
      );
    } else {
      // Non-iOS
      whiteNoiseNode.start(context.currentTime);
    }
  } else {
    // If connected
    if (iOS) {
      whiteNoiseNode.stop(0);
    } else {
      // Non-iOS Sound off
      whiteNoiseNode.stop(0);
      whiteNoiseNode.disconnect();
      // window.location = 'http://127.0.0.1:8881/therapy.html'; // testing
      window.location = "https://www.tafhub.com/labs/stoptinnitus/therapy.html"; //production
    }
    gainNode.disconnect();
  }
  connected = !connected;
};

// *** //NOISE GENERATOR SCRIPT ***

// *** iOS CHECK SCRIPT ***
var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (isSafari && iOS) {
  alert(
    "You are using Safari on iOS! The feature of listening to your music in parallel with the generated sound is not allowed in this browser. Please use Chrome."
  );
}
// *** //iOS CHECK SCRIPT ***

// *** iOS CHECK TOUCH SCRIPT ***
function webAudioTouchUnlock(context) {
  return new Promise(function(resolve, reject) {
    if (context.state === "suspended" && "ontouchstart" in window) {
      var unlock = function() {
        context.resume().then(
          function() {
            document.body.removeEventListener("touchstart", unlock);
            document.body.removeEventListener("touchend", unlock);

            resolve(true);
          },
          function(reason) {
            reject(reason);
          }
        );
      };

      document.body.addEventListener("touchstart", unlock, false);
      document.body.addEventListener("touchend", unlock, false);
    } else {
      resolve(false);
    }
  });
}
// *** //iOS CHECK TOUCH SCRIPT ***

// *** VOLUME SCRIPT ***
var setWhiteNoiseVolume = function() {
  var vol = document.getElementById("whiteNoiseVolRange").value;
  gainNode.gain.value = vol;
};
// *** //VOLUME SCRIPT ***

/* 
// *** NOISE GENERATOR SCRIPT ***
// Create Web Audio API context | Temp workaround until AudioContext is standardized
const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
//bufferSize = 4096;
bufferSize = 44100;

var whiteNoiseNode = context.createBufferSource(),
  buffer = context.createBuffer(1, bufferSize, context.sampleRate),
  data = buffer.getChannelData(0);
for (var i = 0; i < bufferSize; i++) {
  data[i] = Math.random() * 2 - 1;
}
whiteNoiseNode.buffer = buffer;
whiteNoiseNode.loop = true;

var pinkNoiseNode = context.createBufferSource(),
  buffer = context.createBuffer(1, bufferSize, context.sampleRate),
  data = buffer.getChannelData(0);
var b0, b1, b2, b3, b4, b5, b6;
b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
for (var i = 0; i < bufferSize; i++) {
  var white = Math.random() * 2 - 1;
  b0 = 0.99886 * b0 + white * 0.0555179;
  b1 = 0.99332 * b1 + white * 0.0750759;
  b2 = 0.969 * b2 + white * 0.153852;
  b3 = 0.8665 * b3 + white * 0.3104856;
  b4 = 0.55 * b4 + white * 0.5329522;
  b5 = -0.7616 * b5 - white * 0.016898;
  data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
  data[i] *= 0.11; // rough estimation to compensate for gain
  b6 = white * 0.115926;
}
pinkNoiseNode.buffer = buffer;
pinkNoiseNode.loop = true;

var brownNoiseNode = context.createBufferSource(),
  buffer = context.createBuffer(1, bufferSize, context.sampleRate),
  data = buffer.getChannelData(0);
var lastOut = 0.0;
var b0, b1, b2, b3, b4, b5, b6;
b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
for (var i = 0; i < bufferSize; i++) {
  var white = Math.random() * 2 - 1;
  data[i] = (lastOut + 0.02 * white) / 1.02;
  lastOut = data[i];
  data[i] *= 3.5; // rough estimation to compensate for gain
}
brownNoiseNode.buffer = buffer;
brownNoiseNode.loop = true;

function getNoise(noise) {
  // Equations used: https://github.com/zacharydenton/noise.js/blob/master/noise.js
  if (noise == whiteNoise) {
    // alert("whiteNoise");
    noiseNode = whiteNoiseNode;
  }
  if (noise == pinkNoise) {
    alert("pinkNoise");
    noiseNode = pinkNoiseNode;
  }
  if (noise == brownNoise) {
    alert("browneNoiseNode");
    noiseNode = brownNoiseNode;
  } else {
    alert("Restart is needed");
    window.location = "https://www.tafhub.com/labs/stoptinnitus/therapy.html";
  }
  playStopWhiteNoise();
}

var connected = false;

// *** VOLUME ***
var gainNode = context.createGain();
gainNode.gain.value = 0.2; // 20 %
gainNode.connect(context.destination);
// *** //VOLUME ***

// *** PLAY/STOP NOISE ***
var playStopWhiteNoise = function() {
  if (!connected) {
    noiseNode.connect(gainNode);

    if (iOS) {
      alert(
        "Sound started. Un-mute your device or select volume if you cannot hear anything."
      );
      webAudioTouchUnlock(context).then(
        function(unlocked) {
          if (unlocked) {
            // AudioContext was unlocked from an explicit user action,
            // sound should start playing now
            noiseNode.start(context.currentTime);
          } else {
            alert("Restart is needed");
            window.location = "http://127.0.0.1:8881/therapy.html"; // testing
            window.location =
              // "https://www.tafhub.com/labs/stoptinnitus/therapy.html"; //production
          }
        },
        function(reason) {
          console.error(reason);
        }
      );
    } else {
      // Non-iOS
      noiseNode.start(context.currentTime);
    }
  } else {
    // If connected
    if (iOS) {
      noiseNode.stop(0);
    } else {
      // Non-iOS Sound off
      noiseNode.stop(0);
      noiseNode.disconnect();
      window.location = "http://127.0.0.1:8881/therapy.html"; // testing
      // window.location = "https://www.tafhub.com/labs/stoptinnitus/therapy.html"; //production
    }
    gainNode.disconnect();
  }
  connected = !connected;
};
// *** //PLAY/STOP NOISE ***

// *** //NOISE GENERATOR SCRIPT ***

// *** iOS CHECK SCRIPT ***
var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (isSafari && iOS) {
  alert(
    "You are using Safari on iOS! The feature of listening to your music in parallel with the generated sound is not allowed in this browser. Please use Chrome."
  );
}
// *** //iOS CHECK SCRIPT ***

// *** iOS CHECK TOUCH SCRIPT ***
function webAudioTouchUnlock(context) {
  return new Promise(function(resolve, reject) {
    if (context.state === "suspended" && "ontouchstart" in window) {
      var unlock = function() {
        context.resume().then(
          function() {
            document.body.removeEventListener("touchstart", unlock);
            document.body.removeEventListener("touchend", unlock);

            resolve(true);
          },
          function(reason) {
            reject(reason);
          }
        );
      };

      document.body.addEventListener("touchstart", unlock, false);
      document.body.addEventListener("touchend", unlock, false);
    } else {
      resolve(false);
    }
  });
}
// *** //iOS CHECK TOUCH SCRIPT ***

// *** VOLUME SCRIPT ***
var setWhiteNoiseVolume = function() {
  var vol = document.getElementById("whiteNoiseVolRange").value;
  gainNode.gain.value = vol;
};

var setPinkNoiseVolume = function() {
  var vol = document.getElementById("pinkNoiseVolRange").value;
  gainNode.gain.value = vol;
};

var setBrownNoiseVolume = function() {
  var vol = document.getElementById("brownNoiseVolRange").value;
  gainNode.gain.value = vol;
};

//............................................................................................................. alt
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var button = document.querySelector("button");
var myScript = document.querySelector("script");

// Stereo
var channels = 20;
// Create an empty two second stereo buffer at the
// sample rate of the AudioContext
var frameCount = audioCtx.sampleRate * 20.0;

var myArrayBuffer = audioCtx.createBuffer(
  channels,
  frameCount,
  audioCtx.sampleRate
);

button.onclick = function() {
  // Fill the buffer with white noise;
  //just random values between -1.0 and 1.0
  for (var channel = 0; channel < channels; channel++) {
    // This gives us the actual array that contains the data
    var nowBuffering = myArrayBuffer.getChannelData(channel);
    for (var i = 0; i < frameCount; i++) {
      // Math.random() is in [0; 1.0]
      // audio needs to be in [-1.0; 1.0]
      nowBuffering[i] = Math.random() * 2 - 1;
    }
  }

  // Get an AudioBufferSourceNode.
  // This is the AudioNode to use when we want to play an AudioBuffer
  var source = audioCtx.createBufferSource();
  // set the buffer in the AudioBufferSourceNode
  source.buffer = myArrayBuffer;
  // connect the AudioBufferSourceNode to the
  // destination so we can hear the sound
  source.connect(audioCtx.destination);
  // start the source playing
  source.start();

  source.onended = () => {
    console.log("White noise finished");
  };
};

// *** //VOLUME SCRIPT *** */