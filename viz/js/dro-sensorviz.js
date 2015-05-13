
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
		actuallyMakeTheViz($elem, dataRoot);

	} else {
		// assume we got given the data as a data object
		log('Data folder must be supplied as a string url.')

	}

	/////////////////////////////////////////////////////////////////

	function actuallyMakeTheViz($vizWrapper, dataRoot) {

		function sorryNoData(name) {
			return [
				'data:text/html;charset=utf-8,',
				encodeURIComponent('<html style="font-family: sans-serif; padding: 1em; text-align: center;">'),
				encodeURIComponent('Sorry, no data for ' + name + '.')
			].join('');
		}

		var $viz = $('<div class="droviz-wrap">' +
					'<div id="info">Temporarily showing sample data.</div>' +
					'<div id="scape"></div>' +
					'<div id="data"></div>' +
					'</div>');

		$vizWrapper.empty().append($viz);

		window.dro = window.dro || {};

		dro.log = function(msg) {
			console.log('viz: ' + msg);
			var $log = $('#log');
			$log.text(msg + '\n' + $log.text());
			// scroll to the bottom
			$log.scrollTop($log.innerHeight);
		}

		////////////////////////////////////////////////////////// init field

		dro.log('creating and initialising field..');
		dro.f = new Scape.Field({
			minX:  -10, maxX: 110,
			minY:  -10, maxY: 110,
			minZ:   30, maxZ:  80,
			blocksX: 12,
			blocksY: 12,
			blocksZ: 50
		});

		// start off at 30m altitude
		dro.f.addGroundHeights([ { x: 50, y: 50, z: 40 } ]);

		// start with a normal ground stack
		dro.f.addGroundStacks([{
				x:50, y: 50, stack:[
					[Scape.Stuff.leaflitter, 0.1],
					[Scape.Stuff.dirt0,      2],
					[Scape.Stuff.dirt3,      4],
					[Scape.Stuff.dirt6,      6],
					[Scape.Stuff.dirt9,      0]
				]
			}
		]);
		dro.log('  ..field created.');

		//////////////////////////////////////////////////// create the scape

		dro.log('creating scene..');
		var craneDir = 0.1;
		var infoStaticText = $('#info').text();
		dro.s = new Scape.Scene(dro.f, 'scape', {
			currentDate: new Date(2000, 1, 1, 6),  // either string 'now' or a Date object
			timeRatio: 200, // how many times faster than normal?
			dateUpdate: function(date) {
				// update the time display
				hr = date.getHours();
				if (hr != currentHour) {
					timeStr = ((hr - 1) % 12 + 1) + (hr > 12 ? 'pm' : 'am');
					if (timeStr == '0am') timeStr = 'midnight'
					if (timeStr == '12am') timeStr = 'noon'
					$('#info').text(infoStaticText + ' Sun position is ' + timeStr);
					currentHour = hr;
				}
				// update the crane rotation
				var rand = Math.random();
				if (rand < 0.006) { craneDir =  0.0; }
				if (rand < 0.004) { craneDir = -0.1; }
				if (rand < 0.002) { craneDir =  0.1; }
				craneAngle = craneAngle + craneDir;
			},
			click: function(data) {
				dro.log('displaying ' + data.name + ' [' + data.url + ']');
				var $data = $('<div class="frame"><h1>' + data.name + ' (click to close)</h1><iframe src="' + data.url + '"></iframe></div>');
				$('#data').empty().height(0).append($data).animate({ height: '330px' }, 'slow');
				$('#data h1').on('click', function() { $('#data').empty(); });
			}
		});
		dro.log('  ..scene created.');

		////////////////////////////////////////////////////////// load trees

		dro.loadItems(dataRoot, 'tree', function(tree) {
			var opts = { height: tree.height2010,
				         diameter: tree.dbh2013a / 100 };
			// drop in some dendros
			if (Math.random() < 0.05) {
				opts.dendrometer = {
					clickData: {
						url: sorryNoData('dendro #' + tree.id),
						name: 'dendro #' + tree.id
					}
				};
			}
			// drop in some sap meters
			if (Math.random() < 0.05) {
				opts.sapflowmeter = {
					clickData: { url: sorryNoData('sap flow #' + tree.id),
						         name: 'sap flow #' + tree.id },
					name: 'sap flow #' + tree.id
				};
			}
			return new Scape.Item(Scape.ItemTypes.tree, tree.posX, tree.posY, opts);
		});

		/////////////////////////////////////////////////////////// load pits

		dro.loadItems(dataRoot, 'soilpit', function(thing) {
			return new Scape.Item(
				Scape.ItemTypes.soilPit,
				thing.posX, thing.posY,
				{ clickData: {
					url: sorryNoData('soilpit #' + thing.id),
					name: 'soilpit #' + thing.id },
				name: 'soilpit #' + thing.id }
			);
		});

		////////////////////////////////////////////////// load leaf catchers

		dro.loadItems(dataRoot, 'leafcatcher', function(thing) {
			return new Scape.Item(
				Scape.ItemTypes.leafLitterCatcher,
				thing.posX, thing.posY,
				{ clickData: {
					url: sorryNoData('leaf catcher #' + thing.id),
					name: 'leaves #' + thing.id },
				name: 'leaves #' + thing.id }
			);
		});

		/////////////////////////////////////////////////////////// add crane

		dro.log('adding crane..');
		var craneAngle = 100;
		var crane = new ScapeItem(ScapeItems.crane, 50, 50, {
				height: 47,     width: 2,
				length: 55,     rotation: craneAngle,
				camera: {
					name: 'crane camera',
					clickData: {
						name: 'crane camera',
						url: 'https://www.flickr.com/photos/jcu-dro/sets/72157647865924303/player'
					}
				}
		});

		dro.f.addItems([crane]);
		dro.log('  ..crane added.');

		// update the time div when the hour changes
		var hr;
		var currentHour = '';
		var timeStr = '';

		setInterval(function() {
			dro.f.updateItem(crane, { rotation: craneAngle });
		}, 500);

	} // end of actually-make-the-viz function
};

/////////////////////////////////////////////////////////////////////
// now invoke that function
var dataRoot = $('base').attr('href') || '.';
if (dataRoot[dataRoot.length-1] != '/') {
	dataRoot = dataRoot + '/data/';
} else {
	dataRoot = dataRoot + 'data/';
}

buildViz( $('.dro-viz').first(), dataRoot );















