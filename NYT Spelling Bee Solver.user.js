// ==UserScript==
// @name         NYT Spelling Bee Solver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Word solver for the NYT Spelling Bee Game
// @author       nllpntr
// @match        https://www.nytimes.com/puzzles/spelling-bee
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	/*** UI Fuckery ***/

	// create html elements for display:
	var header = jQuery("<div class='sb-progress-box' style='padding: 12px 12px 12px 0;'><h4 class='sb-progress-rank' style='width: auto;'>Cheat Sheet</h4></div>");
	var items = jQuery("<ul class='sb-wordlist-items' style='column-count: 5;' />");
	var wordlist = jQuery("<div class='sb-wordlist' style='padding-top: 25px;' />").append(items);
	var wordlist_box = jQuery("<div class='sb-wordlist-box' />").append(wordlist);
	var container = jQuery("<div class='sb-status-box' />").append(header).append(wordlist_box);

	// append ui-elements: right-aligned sidebar with list of found words
	jQuery(".sb-content-box").append(container);

	// make some ui adjustments
	jQuery(".sb-controls").css("position", "relative").css("top", "320px");
	jQuery(".sb-status-box").css("width", "auto");
	jQuery(".sb-status-box:first").css("width", "25%");
	wordlist.css("width","auto");
	wordlist.css("position","relative");
	items.css("height", "auto");

	/*** End UI Fuckery ***/

	var center = jQuery(".hive-cell.center text").text();     // get center letter
	var outer = jQuery(".hive-cell.outer text").text();       // get outer letters as a string
	var all_chars = center + outer;                           // all valid letters in one string

	// path to online word dictionary
	var dict_url = "https://raw.githubusercontent.com/zeisler/scrabble/master/db/dictionary.csv";
	var dict = "";
	var words = [];
	var pangrams = [];
	var found_words = []; // array of words already found and entered

	jQuery(".sb-wordlist-items li").each(function() {
		found_words.push(jQuery(this).text()); // collect found words
	});

	// load the dictionary content
	jQuery.get(dict_url, function(response) {

		// split words in the dictionary by newlines
		dict = response.toLowerCase().replaceAll("\r", "").split("\n");

		words = dict.filter(word => word.length > 3);               // filter out words with length < 4
		words = words.filter(word => word.includes(center));        // filter out words that don't contain the center letter
		words = words.filter(invalidChars);                         // filter out all words with letters not present in all_chars
		words = words.filter(word => !found_words.includes(word));  // filter out words that have already been entered
		words = words.sort(function(a, b) {                         // sort by length, descending
			return b.length - a.length;
		});

		// find pangrams
		for ( var i = 0; i < words.length; i++ ) {
			var word = words[i];
			var isPangram = true;
			for ( var j = 0; j < all_chars.length; j++ ) {
				if ( !word.includes(all_chars[j]) )
					isPangram = false;
			}
			if (isPangram)
				pangrams.push(word);
		}

		// iterate on remaining solved words, append list items to UI
		for ( i = 0; i < words.length; i++ ) {
			var item = jQuery("<li><span class='sb-anagram'>" + words[i] + "</span></li>");
			items.append(item);
			if ( pangrams.includes(words[i]) )
				item.css("color", "#f00");     // highlight word if it's a pangram
		};

	});

	// custom array filter, keeps words that only contain letters in all_chars
	function invalidChars(word) {
		for ( var i = 0; i < word.length; i++ ) {
			if ( all_chars.indexOf(word[i]) < 0 ) {
				return false;
			}
		}
		return true;
	}

})();
