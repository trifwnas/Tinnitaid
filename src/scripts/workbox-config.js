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

module.exports = {
  "globDirectory": "https://tafhub.com/labs/stoptinnitus/",
  "globPatterns": [
    "img/**.*",
    "offline.html",
    "icons/**.*"
  ],
  "swSrc": "/labs/stoptinnitus/sw.js",
  "swDest": "/labs/stoptinnitus/sw.js",
  "globIgnores": [
    "./workbox-cli-config.js"
  ]
};
