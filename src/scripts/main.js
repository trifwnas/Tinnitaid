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
oscillator.frequency.value = 3000;
var connected = false;
gainNode.gain.value = 0.2;

/* function iOS() {
  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ];
  
  if ((!navigator.platform) || (!navigator.userAgent)) {
    while (iDevices.length) {
      if ((navigator.platform == iDevices.pop()) || (navigator.userAgent == iDevices.pop())) {
        return true;
      }
    }
  }
  return false;
} */

var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (isSafari && iOS) {
  alert("The app is not supported by Safari on iOS! Please use Chrome.");
}

var playpause = function () {
  if (!connected) {

    if (iOS) {
      // play right now (0 seconds from now)
      oscillator.noteOn(0);
    }
    else{
      // Connect Oscillator to Gain Node to Speakers
      oscillator.connect(gainNode);
      
    }
    gainNode.connect(context.destination);

  }
  else {

    if (iOS) {
      oscillator.noteOff(0);
      //oscillator.stop(0);
    }
    else{
      oscillator.disconnect();
      
    }
    gainNode.disconnect();
  }
  connected = !connected;
};

var setVolume = function () {
  var vol = document.getElementById("volRange").value;
  //var now = context.currentTime;
  //gainNode.gain.setValueAtTime(vol, now);
  //gainNode.gain.exponentialRampToValueAtTime(vol, now + 0.5);	
  gainNode.gain.value = vol;
}

var setFrequency = function () {
  var input = document.getElementById('input');
  oscillator.frequency.value = +input.value;
  var freq = document.getElementById("input").value;
  document.getElementById("freqRange").value = freq;
  var output = document.getElementById("demo");
  output.innerHTML = freq;
}

var setFrequencySlider = function () {
  var input = document.getElementById('freqRange');
  oscillator.frequency.value = +input.value;
  var freq = document.getElementById("freqRange").value;
  document.getElementById("input").value = freq;
}