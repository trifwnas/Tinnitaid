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

// *** SLIDE SHOW VALUE SCRIPT ***
var slider = document.getElementById("freqRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;
slider.oninput = function () {
output.innerHTML = this.value;}
// *** //SLIDE SHOW VALUE SCRIPT ***

// *** iOS CHECK SCRIPT ***
var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (isSafari && iOS) {
  alert("You are using Safari on iOS! The feature of listening to your music in parallel with the generated sound is not allowed in this browser. Please use Chrome.");
}
// *** //iOS CHECK SCRIPT ***

// *** iOS CHECK SCRIPT ***
function webAudioTouchUnlock (context)
{
    return new Promise(function (resolve, reject)
    {
        if (context.state === 'suspended' && 'ontouchstart' in window)
        {
            var unlock = function()
            {
                context.resume().then(function()
                {
                    document.body.removeEventListener('touchstart', unlock);
                    document.body.removeEventListener('touchend', unlock);

                    resolve(true);
                }, 
                function (reason)
                {
                    reject(reason);
                });
            };

            document.body.addEventListener('touchstart', unlock, false);
            document.body.addEventListener('touchend', unlock, false);
        }
        else
        {
            resolve(false);
        }
    });
}

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
gainNode.gain.value = 0;

var playpause = function () {
  if (!connected) {
    gainNode.connect(context.destination);

    if (iOS) {
    webAudioTouchUnlock(context).then(function (unlocked)
    {
        if(unlocked)
        {
            // AudioContext was unlocked from an explicit user action,
            // sound should start playing now
            alert('Sound started. Un-mute your device or select volume if you cannot hear anything.');
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

// *** VOLUME SCRIPT ***
var setVolume = function () {
  var vol = document.getElementById("volRange").value;
  gainNode.gain.value = vol;
}
// *** //VOLUME SCRIPT ***

// *** FREQUENCY SCRIPT ***
var setFrequency = function () {
  var input = document.getElementById('input');
  oscillator.frequency.value = +input.value;
  var freq = document.getElementById("input").value;
  document.getElementById("freqRange").value = freq;
  var output = document.getElementById("demo");
  output.innerHTML = freq;
}
// *** //FREQUENCY SCRIPT ***

// *** FREQUENCY SLIDER SCRIPT ***
var setFrequencySlider = function () {
  var input = document.getElementById('freqRange');
  oscillator.frequency.value = +input.value;
  var freq = document.getElementById("freqRange").value;
  document.getElementById("input").value = freq;
}
// *** //FREQUENCY SLIDER SCRIPT ***