define('SFG.LayoutLoader', function () {
	var LayoutLoader = {};

	LayoutLoader.load = function (controllerName, callback) {
		var filename = controllerName.replace('Controller', '').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();

		if (typeof loadedLayouts[filename] === 'undefined') {
			loadedLayouts[filename] = true;
			this.getLayoutFile(filename, callback);
		}

		return $('script#import_' + filename);
	};

	LayoutLoader.getLayoutFile = function (filename) {
		var path = 'assets/layouts/' + filename + '.html';
		$.get(path, callback);
	};

	return LayoutLoader;
});



var foo;

require(['SFG.LayoutLoader'], function (LayoutLoader) {

	foo = LayoutLoader.load('MainController');

});
