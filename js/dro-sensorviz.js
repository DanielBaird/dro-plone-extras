
function buildViz(vizElement, dataRoot) {

	function log(msg) {
		console.log(msg);
	}

	var $elem = $(vizElement);

	if ($elem.length < 1) {
		log('Visualisation element (' + vizElement + ') not found.');
		return;
	}

	$elem.empty().append($('<p>constructing visualisation..</p>'));
	$elem.addClass('dro-viz');

	// if we didn't get any data, use sample data.
	if (typeof dataRoot === 'undefined') {
		log('Data folder must be supplied.')

	} else if (typeof dataRoot === 'string') {
		// we got a string so assume it's a URL and load the data from there
		$elem.empty().append($('<p>loading viz data..</p>'));
		actuallyMakeTheCalendar($elem, dataRoot);

	} else {
		// assume we got given the data as a data object
		log('Data folder must be supplied as a string url.')

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















