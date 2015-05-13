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

	// load calendar?
	if ($('.dro-calendar').length > 0) {
		buildCalendar('.dro-calendar');
	}

	// load sensor viz?
	if ($('.dro-viz').length > 0) {
		// plone pages always have a base tag
		var pageBaseUrl = $('base').attr('href') || './';
		//
		// This is the awful way you need to load js dynamically
		// (so other pages don't have to load these scripts) but
		// still have them execute in the right order (so stuff
		// that needs THREE.js doesn't try to run while it's still
		// downloading).
		//
		// http://www.html5rocks.com/en/tutorials/speed/script-loading/
		//
		!function(e,t,r){function n(){for(;d[0]&&"loaded"==d[0][f];)c=d.shift(),c[o]=!i.parentNode.insertBefore(c,i)}for(var s,a,c,d=[],i=e.scripts[0],o="onreadystatechange",f="readyState";s=r.shift();)a=e.createElement(t),"async"in i?(a.async=!1,e.head.appendChild(a)):i[f]?(d.push(a),a[o]=n):e.write("<"+t+' src="'+s+'" defer></'+t+">"),a.src=s}(document,"script",[
			pageBaseUrl + '/js/three.min.js',
			pageBaseUrl + '/js/helvetiker_regular.typeface.js',
			pageBaseUrl + '/js/orbit-controls.js',
			pageBaseUrl + '/js/scape.js',
			pageBaseUrl + '/js/item-loader.js',
			pageBaseUrl + '/js/dro-sensorviz.js' // automatically runs on the first .dro-viz element in the page
		])
	}

});
