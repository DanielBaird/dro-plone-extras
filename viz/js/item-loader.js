
window.dro = window.dro || {}

dro.loadItems = function(rootUrl, itemName, formatter, dataListKey) {

	dataListKey = dataListKey || 'data';
	if (rootUrl[rootUrl.length-1] != '/') {
		rootUrl = rootUrl + '/';
	}

	dro.log('loading ' + itemName + ' list..');
	var loader = $.getJSON(rootUrl + itemName + '-list.json');

	loader.done( function(data) {
		dro.log('  ..' + itemName + ' list loaded.');

		list = data[dataListKey];

		if (list) {
			dro.log('Creating ' + itemName + ' items  (' + list.length + ' to create)..');
			var items = [];
			var item;
			var lastLog = new Date();

			for (var i = list.length-1; i >= 0; i--) {
				item = formatter(list[i]);
				items.push(item);

				if (((new Date()) - lastLog) > 3000) {
					dro.log('  (created ' + items.length + ' ' + itemName + ' items so far)');
					lastLog = new Date();
				}
			}

			dro.log('  ..' + items.length + ' ' + itemName + ' items created.');
			setTimeout(function() {
				dro.log('adding ' + itemName + ' items to scene..')
				dro.f.addItems(items);
				dro.log('  ..' + itemName + ' items added.')
			})

		} else {
			dro.log('Failed to load ' + itemName + ' list; key "' + dataListKey + '" not found in loaded file.');
		}
	});

	return loader;
};