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

For the complete license, please refer here: http://eurematic.com/labs/stoptinnitus/LICENSE.txt
************************************************************************
 */
// *** MUSIC PLAYER SCRIPT ***
// Create Web Audio API context | Temp workaround until AudioContext is standardized 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

// Frequency
// Create Oscillator
var oscillator = context.createOscillator();

// Volume
// Create Gain Node
var gainNode = context.createGain();

// Init
oscillator.start(0);
oscillator.frequency.value = 1000;
var connected = false;
gainNode.gain.value = 0.2;

var playpause = function () {
    if (!connected) {
      gainNode.connect(context.destination);
  
      if (iOS) {
      alert('Sound started. Un-mute your device or select volume if you cannot hear anything.');
      webAudioTouchUnlock(context).then(function (unlocked)
      {
          if(unlocked)
          {
              // AudioContext was unlocked from an explicit user action,
              // sound should start playing now
              
              oscillator.connect(gainNode);
              oscillator.start(0);
          }
          else
          {
              alert('Restart is needed');
              window.location = 'http://www.eurematic.com/labs/stoptinnitus/';
              
              // Device other than iOS
              //oscillator.connect(gainNode);
              //oscillator.start(0);
          }
      },
      function(reason)
      {
          console.error(reason);
      });
      }
      else{
          // Non-iOS
          oscillator.connect(gainNode);
      }
    }
    else {
      // If connected
      if (iOS) {
        oscillator.stop(0);
      }
      else{
      // Non-iOS Sound off
        oscillator.disconnect();      
      }
      gainNode.disconnect();
    }
    connected = !connected;
  };
  // *** //MUSIC PLAYER SCRIPT ***

// *** WHITE NOISE ***
var bufferSize = 2 * audioContext.sampleRate,
    noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate),
    output = noiseBuffer.getChannelData(0);
for (var i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
}

var whiteNoise = audioContext.createBufferSource();
whiteNoise.buffer = noiseBuffer;
whiteNoise.loop = true;
whiteNoise.start(0);

whiteNoise.connect(audioContext.destination);

// *** PINK NOISE ***
var bufferSize = 4096;
var pinkNoise = (function() {
    var b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = function(e) {
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            var white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            output[i] *= 0.11; // (roughly) compensate for gain
            b6 = white * 0.115926;
        }
    }
    return node;
})();

pinkNoise.connect(audioContext.destination);


// *** BROWN NOISE ***
var bufferSize = 4096;
var brownNoise = (function() {
    var lastOut = 0.0;
    var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = function(e) {
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            var white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5; // (roughly) compensate for gain
        }
    }
    return node;
})();

brownNoise.connect(audioContext.destination);