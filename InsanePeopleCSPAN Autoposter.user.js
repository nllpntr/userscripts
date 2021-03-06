// ==UserScript==
// @name         InsanePeopleCSPAN Autoposter
// @namespace    http://reddit.com/r/insanepeoplecspan
// @version      0.2
// @description  Adds links to the c-span transcript window to allow quick text posts to r/insanepeoplecspan
// @author       nllpntr
// @match        https://www.c-span.org/video/*
// @grant        none
// @updateURL    https://github.com/nllpntr/userscripts/raw/master/InsanePeopleCSPAN%20Autoposter.user.js
// ==/UserScript==

(function() {
    'use strict';
    jQuery(document).ready(function() {
        var pageTitle = jQuery(".video-page-title").text();
        var pageURL = document.location.href;
        if ( pageURL.indexOf("start=") > 0 ) {
            pageURL = pageURL.substring(0, pageURL.indexOf("&start=")).replace("&live", "&vod");
        }

        var id = setInterval(function() {
            if ( jQuery("th a.transcript-time-seek").length > 0 ) {
                clearInterval(id);
                jQuery("th a.transcript-time-seek").each(function() {
                    var timecode_readable = jQuery(this).parent().text().trim();
                    var postBtn = jQuery("<a time='" + timecode_readable + "' href='javascript:void(0);'>Post to r/IPCS</a>").click(function() {
                        var timecode = jQuery(this).prev().attr('id').replace("transcript-time-", "");
                        var linkURL = pageURL + "&start=" + timecode;
                        var link = "[" + pageTitle + " \[" + timecode_readable + "\]](" + linkURL + ")";
                        var paragraphs = [];
                        jQuery(this).parent().next().next().find("p.short_transcript").each(function() {
                            var txt = ">" + jQuery(this).text().toLowerCase().trim().replace(/\n/g,">\n\n");
                            paragraphs.push(txt);
                        });
                        var quote = paragraphs.join("\n\n");
                        var content = quote + "\n\n" + link;
                        var URL = "https://www.reddit.com/r/insanepeoplecspan/submit?selftext=true&title=&text=" + encodeURIComponent(content);
                        window.open(URL, '_blank');
                    });
                    jQuery(this).parent().append(postBtn);
                });
            }
        }, 250);
    });
})();
