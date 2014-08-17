/**
 * Load and caches layout files
 * @module Caviar.LayoutLoader
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('LayoutLoader', ['Caviar'], function (Caviar) {
	var Cache, LayoutLoader;

	Cache = {};

	return LayoutLoader = {
		/**
		 * Parses the layout of the controller and loads it
		 * @param  {String}   controllerName Controller name
		 * @param  {Function} callback       Callback
		 * @param  {Function} callback.data  Layout content
		 */
		load: function (controllerName, callback) {
			var filename;
			filename = controllerName.replace('Controller', '').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
			return this.getLayoutFile(filename, callback);
		},

		/**
		 * Request a layout file
		 * @param  {String}   filename      Filename without .html extension
		 * @param  {Function} callback      Callback
		 * @param  {Function} callback.data Layout content	
		 */
		getLayoutFile: function (filename, callback) {
			var cached, xmlhttp, path;
			
			if (Caviar.runningOnWP()) { 
				// Request for local path requires a special path when running
				// on Windows Phone 8 WebView
				path = "x-wmapp0:www/assets/layouts/" + filename + ".html";
			} else {
				path = "assets/layouts/" + filename + ".html";
			}

			cached = Cache[path] || null;

			if (cached !== null) {
				return callback(cached);
			}

			xmlhttp = new XMLHttpRequest();

			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState == 4) {
					Cache[path] = xmlhttp.responseText;
					return callback(xmlhttp.responseText);
				}
			};

			xmlhttp.open("GET", path, true);
			xmlhttp.send();

			return;
		}
	};
});
