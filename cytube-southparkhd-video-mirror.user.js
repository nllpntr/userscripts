// ==UserScript==
// @name         Cytu.be Southpark Channel Video Mirroring
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mirrors the video on the South Park HD channel: https://cytu.be/r/southparkhd
// @author       nllpntr
// @match        https://cytu.be/r/southparkhd
// @grant        none
// @updateURL    https://raw.githubusercontent.com/nllpntr/userscripts/master/cytube-southparkhd-video-mirror

// ==/UserScript==

(function() {
    'use strict';
	$(function() {
		var s = $("<style>#ytapiplayer_html5_api { transform: scaleX(-1) !important; }</style>");
		$("body").append(s);
	});
})();
