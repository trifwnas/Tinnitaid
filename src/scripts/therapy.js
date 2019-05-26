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


(function(AudioContext) {
	AudioContext.prototype.createWhiteNoise = function(bufferSize) {
		bufferSize = bufferSize || 4096;
		var node = this.createScriptProcessor(bufferSize, 1, 1);
		node.onaudioprocess = function(e) {
			var output = e.outputBuffer.getChannelData(0);
			for (var i = 0; i < bufferSize; i++) {
				output[i] = Math.random() * 2 - 1;
			}
		}
		return node;
	};

	AudioContext.prototype.createPinkNoise = function(bufferSize) {
		bufferSize = bufferSize || 4096;
		var b0, b1, b2, b3, b4, b5, b6;
		b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
		var node = this.createScriptProcessor(bufferSize, 1, 1);
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
	};

	AudioContext.prototype.createBrownNoise = function(bufferSize) {
		bufferSize = bufferSize || 4096;
		var lastOut = 0.0;
		var node = this.createScriptProcessor(bufferSize, 1, 1);
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
	};
})(window.AudioContext || window.webkitAudioContext);

var context = new webkitAudioContext();
var brown_noise = context.createBrownNoise();
var pink_noise = context.createPinkNoise();
var white_noise = context.createWhiteNoise();
white_noise.connect(context.destination);






















/* var audioContext = new (window.webkitAudioContext || window.AudioContext)();
    
var whiteNoise = audioContext.createWhiteNoise();
var whiteGain = audioContext.createGain();
whiteGain.gain.value = 0;
whiteNoise.connect(whiteGain);
whiteGain.connect(audioContext.destination);

var pinkNoise = audioContext.createPinkNoise();
var pinkGain = audioContext.createGain();
pinkGain.gain.value = 0;
pinkNoise.connect(pinkGain);
pinkGain.connect(audioContext.destination);

var brownNoise = audioContext.createBrownNoise();
var brownGain = audioContext.createGain();
brownGain.gain.value = 0;
brownNoise.connect(brownGain);
brownGain.connect(audioContext.destination);

var toggleDemo = function(text, gain) {
    var handler = function(e) {
        if (gain.gain.value == 0.0) {
            $(e.target).text("Stop");
            gain.gain.value = 0.3;
        } else {
            $(e.target).text(text);
            gain.gain.value = 0.0;
        }
    };
    return handler;
};

$("#white-demo").click(toggleDemo("White Noise", whiteGain));
$("#pink-demo").click(toggleDemo("Pink Noise", pinkGain));
$("#brown-demo").click(toggleDemo("Brown Noise", brownGain));

// *** DEFAULT SOUNDS SCRIPT ***
(function(AudioContext) {
	AudioContext.prototype.createWhiteNoise = function(bufferSize) {
		bufferSize = bufferSize || 4096;
		var node = this.createScriptProcessor(bufferSize, 1, 1);
		node.onaudioprocess = function(e) {
			var output = e.outputBuffer.getChannelData(0);
			for (var i = 0; i < bufferSize; i++) {
				output[i] = Math.random() * 2 - 1;
			}
		}
		return node;
	};

	AudioContext.prototype.createPinkNoise = function(bufferSize) {
		bufferSize = bufferSize || 4096;
		var b0, b1, b2, b3, b4, b5, b6;
		b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
		var node = this.createScriptProcessor(bufferSize, 1, 1);
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
	};

	AudioContext.prototype.createBrownNoise = function(bufferSize) {
		bufferSize = bufferSize || 4096;
		var lastOut = 0.0;
		var node = this.createScriptProcessor(bufferSize, 1, 1);
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
	};
})(window.AudioContext || window.webkitAudioContext);


// *** FREQUENCY SCRIPT ***
var whitenoise = function () {
  var context = new webkitAudioContext();
  var whiteNoise = context.createWhiteNoise();
  whiteNoise.connect(context.destination);
} */