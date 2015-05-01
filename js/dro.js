/*
DRO customisations

(1 April 2015)
paste this content into the DRO plone site at:
https://research.jcu.edu.au/dro/dro_custom.js/manage

It will run on every page in the /dro/ site.
*/
/*jslint white:false, onevar:true, undef:true, nomen:true, eqeqeq:true, plusplus:true, bitwise:true, regexp:true, newcap:true, immed:true, strict:false, browser:true */
/*global jQuery:false, document:false, window:false, location:false */

jQuery(function ($) {

	// look for p tags and td tags that start with TODO
	var $ptags = $('#content p, #content td');

	var todoPrefix = 'todo';
	$ptags.each( function(index, p) {

		var $p = $(p);
		var pText = $p.text().toLowerCase();
		if (pText.slice(0, todoPrefix.length) == todoPrefix) {
			// then it's a todo paragraph
			$p.addClass('todo');

			if (pText.indexOf(' pic') != -1) {
				// then it's a pic todo
				$p.addClass('todo-pic');
				// $p.addClass('todo-pic-' + (Math.floor(Math.random() * 10)));
				$p.addClass('todo-pic-' + (index % 10));

				if (pText.indexOf('small') != -1) {
					// it's a small pic
					$p.addClass('todo-pic-small');
				}

				if (pText.indexOf('strip') != -1) {
					// it's a small pic
					$p.addClass('todo-pic-strip');
				}
			}
		}
	});

	// load calendar
	if ($('.dro-calendar').length > 0) {
		buildCalendar('.dro-calendar');
	}

});
