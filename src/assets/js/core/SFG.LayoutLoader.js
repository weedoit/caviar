define('SFG.LayoutLoader', function () {
	var LayoutLoader = {};

	LayoutLoader.load = function (controllerName, callback) {
		var filename = controllerName.replace('Controller', '').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
		this.getLayoutFile(filename, callback);
	};

	LayoutLoader.getLayoutFile = function (filename, callback) {
		var path = 'assets/layouts/' + filename + '.html';
		$.get(path, callback);
	};

	return LayoutLoader;
});