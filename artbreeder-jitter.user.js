// ==UserScript==
// @name         Artbreeder Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Push sliders around programmatically
// @author       nllpntr
// @match        https://www.artbreeder.com/i?k=*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

(function() {
    'use strict';
	console.log("loaded");
	var id = setInterval(function() {
		tickle();
	}, 3000);


	var btn = jQuery("<button>Stop</button>").click(function() {
		if ( id == null ) {
			id = setInterval(function() {
				tickle();
			}, 3000);
			jQuery(this).text("Stop");
		}
		else {
			clearInterval(id);
			id = null;
			jQuery(this).text("Automate");
		}
	});

	jQuery(".buttons_container").append(btn);
	jQuery("<style>#adjust_row,#random_row { display: block !important; }</style>").appendTo("body");


	jQuery("#fullscreen_container img").css("object-fit", "fill");
	jQuery("#fullscreen_container").show();
	jQuery(".mutation_amount input").val(1.0).change();
	jQuery(".mutation_amount .repeat").click();
	var controls = jQuery(".gene_controller input.slider-input");

	var popupWindow = window.open("", "_blank", "toolbar=no,scrollbars=yes,resizable=yes,top=50,left=50,width=820,height=600");
	var popup = jQuery(popupWindow.document.body);

	jQuery("#adjust_row").appendTo(popup).wrap("<div class='row portraits_sg2 portraits' />")
		.css("flex-direction", "column")
		.css("align-content", "stretch");

	jQuery("<style>.gene_controller { display: flex; }</style>").appendTo(popup);
	jQuery("<link rel='stylesheet' href='https://artbreeder.com/css/gene_slider.css' />").appendTo(popup);

	popupWindow.addEventListener('beforeunload', (event) => {
		jQuery(popup).find("#adjust_row").prependTo(".right_inner_container");
	});

	window.addEventListener('beforeunload', (event) => {
		popupWindow.close();
	});

	function saveMutatedChild() {
		var mutants = jQuery("#random_row .opt_container");
		var index = Math.floor(Math.random() * mutants.length);
		mutants.get(index).click();
		console.log("Loading mutant...");
	}


	function selectSavedChild() {
		var savedChildren = jQuery(".children_container a.imglink");
		if ( savedChildren.length > 0 ) {
			console.log("Loading saved child...");
			var index = Math.floor(Math.random() * savedChildren.length);
			savedChildren.get(index).click();
		}

	}

	function tickle() {

		var index = Math.floor(Math.random() * controls.length);
		var control = controls[index];

		var value = parseFloat(jQuery(control).val());
		var offset = (Math.random() - .5);
		value += offset;
		if ( value > 2 ) value -= 2;
		if ( value < -2 ) value += 2;
		jQuery("#fullscreen_container img").attr("src", jQuery("#main_image").attr("src"));
		jQuery(control).val(value).change();

	}
})();
