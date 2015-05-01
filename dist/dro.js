
function buildCalendar(calElement, data) {

	function log(msg) {
		console.log(msg);
	}

	var $elem = $(calElement);

	if ($elem.length < 1) {
		log('Calendar element (' + calElement + ') not found.');
		return;
	}

	$elem.empty().append($('<p>constructing calendar..</p>'));
	$elem.addClass('dro-calendar');

	// if we didn't get any data, use sample data.
	if (typeof data === 'undefined') {

		log('Calendar will be constructed using sample data.')
		actuallyMakeTheCalendar($elem, {

			start: 'January 2015',
			monthsLong: 18,
			calendars: [
				{ 	name: 'Qld School Terms', type: 'reference', blocks: [
					{ message: 'Term 1, 2015',  start: '27 Jan 2015',  end: '02 Apr 2015' },
					{ message: 'Term 2, 2015',  start: '20 Apr 2015',  end: '26 Jun 2015' },
					{ message: 'Term 3, 2015',  start: '13 Jul 2015',  end: '18 Sep 2015' },
					{ message: 'Term 4, 2015',  start: '06 Oct 2015',  end: '11 Dec 2015' },

					{ message: 'Term 1, 2016',  start: '25 Jan 2016',  end: '24 Mar 2016' },
					{ message: 'Term 2, 2016',  start: '11 Apr 2016',  end: '24 Jun 2016' }
				]},
				{ 	name: 'NSW School Terms', type: 'reference', blocks: [
					{ message: 'Term 1, 2015',  start: '27 Jan 2015',  end: '02 Apr 2015' },
					{ message: 'Term 2, 2015',  start: '20 Apr 2015',  end: '26 Jun 2015' },
					{ message: 'Term 3, 2015',  start: '13 Jul 2015',  end: '18 Sep 2015' },
					{ message: 'Term 4, 2015',  start: '06 Oct 2015',  end: '18 Dec 2015' },

					{ message: 'Term 1, 2016',  start: '27 Jan 2016',  end: '08 Apr 2016' },
					{ message: 'Term 2, 2016',  start: '26 Apr 2016',  end: '01 Jul 2016' }
				]},
				{ 	name: 'Dorms', blocks: [
					{ message: 'available',  start: '07 Jan 2015',  end: '04 Feb 2015',  type: 'good' },
					{ message: 'available',  start: '19 Feb 2015',  end: '12 Apr 2015',  type: 'good' },
					{ message: 'call',       start: '13 Apr 2015',  end: '28 Apr 2015',  longMessage: 'call, some places available' },
				]},
				{ 	name: 'Researcher Rooms', blocks: [
					{ message: 'available',  start: '07 Jan 2015',  end: '04 Feb 2015',  type: 'good' },
					{ message: 'available',  start: '06 Feb 2015',  end: '04 Apr 2015',  type: 'good' },
					{ message: 'call',       start: '09 Apr 2015',  end: '12 Apr 2015',  longMessage: 'call, some places available' },
					{ message: 'available',  start: '20 Apr 2015',  end: '05 Mar 2015',  type: 'good', longMessage: 'available - great time for cassowaries' },
				]},
				{ 	name: 'Crane', blocks: [
					{ message: 'available',   start: '14 Jan 2015',  end: '20 Jan 2015',  type: 'good' },
					{ message: 'available',   start: '04 Feb 2015',  end: '04 Feb 2015',  type: 'good' },
					{ message: 'maintenance', start: '10 Feb 2015',  end: '07 Apr 2015',  type: 'alert' },
					{ message: 'available',   start: '10 Apr 2015',  end: '29 Apr 2015',  type: 'good' },
				]}
			]

		});

	} else if (typeof data === 'string') {
		// we got a string so assume it's a URL and load the data from there
		$elem.empty().append($('<p>loading calendar data..</p>'));
		$.ajax({
			url: data,
			dataType: 'json'
		}).done(function(data) {
			actuallyMakeTheCalendar($elem, data);
		}).fail(function(x, status, err) {
			$elem.clear().append($('<p>Problem loading calendar data</p><pre>' + err + '</pre>'));
		});
	} else {
		// assume we got given the data as a data object
		actuallyMakeTheCalendar($elem, data);
	}

	/////////////////////////////////////////////////////////////////

	function actuallyMakeTheCalendar($calWrapper, calData) {

		var $cal = $('<div class="droc-wrap">' +
						'<div class="droc-titles"></div>' +
						'<div class="droc-cals"></div>' +
						'<button type="button" class="droc-left">&lt;</button>' +
						'<button type="button" class="droc-right">&gt;</button>' +
					'</div>');

		// attach click handlers to the left and right buttons
		$cal.find('.droc-left').on('click', function() {
			var $c = $cal.find('.droc-cals');
			$c.scrollLeft( $c.scrollLeft() - $cal.width()/4);
		});
		$cal.find('.droc-right').on('click', function() {
			var $c = $cal.find('.droc-cals');
			$c.scrollLeft( $c.scrollLeft() + $cal.width()/4);
		});

		// add dates to the top row
		var startStr = '01 ' + calData.start + ' 12:00';
		var startDay = new Date(startStr);

		var endDay = new Date(startDay);
		endDay.setMonth(startDay.getMonth() + calData.monthsLong);

		var dateRow = $('<div class="droc-cal reference dates"></div>');

		// loop through months
		var day = new Date(startDay);
		while (day < endDay) {
			// add another month
			var monthEnd = new Date(day); // the first day of the month we're drawing
			monthEnd.setMonth(day.getMonth() + 1); // go a month forward
			monthEnd.setDate(0); // go back one day, to the last day of the month being drawn
			var width = monthEnd.getDate(); // how many days long is it?
			var firstWeekDay = day.getDay(); // weekday starting month (0 = sun, 1 = mon...)

			var monthBlock = $('<div class="droc-block" style="width: ' + width + 'em"></div>');
			monthBlock.addClass('first-weekday-' + firstWeekDay);
			monthBlock.html('<span>' +
				monthEnd.toLocaleString('en-us', { month: 'long', year: 'numeric' }) +
				'</span>'
			);

			dateRow.append(monthBlock);

			day.setMonth(day.getMonth() + 1);
		}

		$cal.find('.droc-titles').append('<div class="droc-title">Dates</div>');
		$cal.find('.droc-cals').append(dateRow);

		// now lop through each of the calendars
		for (var c = 0; c < calData.calendars.length; c++) {
			var thisCal = calData.calendars[c];
			var day = new Date(startDay);
			var calRow = $('<div class="droc-cal"></div>');
			if (thisCal.type) {
				calRow.addClass(thisCal.type);
			}
			for (var b = 0; b < thisCal.blocks.length; b++) {
				var thisBlock = thisCal.blocks[b];

				var blockStart = new Date(thisBlock.start + ' 12:00');
				if (blockStart < day) { blockStart = new Date(day); }

				if (blockStart > day) {
					var startGap = Math.round((blockStart - day) / (1000 * 60 * 60 * 24));
					calRow.append('<div class="droc-block droc-gap" style="width: ' + startGap + 'em"></div>');
				}

				var blockEnd = new Date(thisBlock.end + ' 12:00');
				if (blockEnd <= blockStart) {
					blockEnd = new Date(blockStart);
					blockEnd.setDate(blockEnd.getDate() + 1);
				}

				// length is +1 because we specify the first and last days
				var blockLength = Math.round((blockEnd - blockStart) / (1000 * 60 * 60 * 24)) + 1;
				var block = $('<div class="droc-block" style="width: ' + blockLength + 'em"></div>');
				if (thisBlock.type) {
					block.addClass(thisBlock.type);
				}
				block.html('<span>' + thisBlock.message + '</span>');
				block.attr('title', [
					(thisBlock.longMessage ? thisBlock.longMessage : thisBlock.message),
					'::',
					blockStart.toLocaleString('en-us', { weekday: 'long', day: 'numeric', month: 'short' }),
					'–',
					blockEnd.toLocaleString('en-us', { weekday: 'long', day: 'numeric', month: 'short' })
				].join(' ').replace('  ', ' '));

				calRow.append(block);

				day = blockEnd.setDate(blockEnd.getDate() + 1);
			}
			$cal.find('.droc-titles').append('<div class="droc-title">' + thisCal.name + '</div>');
			$cal.find('.droc-cals').append(calRow);

		}

		$calWrapper.empty().append($cal);
		$calWrapper.addClass('cals-' + $cal.find('.droc-cal').length);
	} // end of actually-make-the-calendar function
}















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
