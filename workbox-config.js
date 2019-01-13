/*
							 Developed by Tryfon Tzanetis
								trif.tz@gmail.com
									  ____
									 (_  _)
									   )( 
									  (__)
*/
module.exports = {
  "globDirectory": "./",
  "globPatterns": [
    "img/**.*",
    "offline.html",
    "icons/**.*"
  ],
  "swSrc": "src/sw.js",
  "swDest": "sw.js",
  "globIgnores": [
    "./workbox-cli-config.js"
  ]
};
