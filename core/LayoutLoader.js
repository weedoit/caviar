/*global define:true, XMLHttpRequest:true */
/**
 * Load and caches layout files
 * @module Caviar.LayoutLoader
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('LayoutLoader', ['Caviar', 'Config', 'View', 'LayoutCache'], function (Caviar, Config, View, LayoutCache) {
    var ViewsCache, LayoutLoader, controllerNameToLayout;

    ViewsCache = {};

    /**
     * Convert a controller name to layout filename
     * @param  {String} str Controller name
     * @return {String}     Layout filename
     */
    controllerNameToLayout = function (str) {
        return str.replace('Controller', '').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    };

    LayoutLoader = {
        /**
         * Parses the layout of the controller and loads it
         * @param  {String}   controllerName Controller name
         * @param  {Function} callback       Callback
         * @param  {Function} callback.view  View object
         */
        load: function (controllerName, callback) {
            var filename;
            filename = controllerNameToLayout(controllerName);
            return this.getViewObject(filename, callback);
        },

        /**
         * Preloads a layout
         * @param  {String} layoutName Layout filename without extension or controller name
         * @return {void}
         */
        preload: function (layoutName) {
            var filename;

            filename = (layoutName.indexOf('Controller') > 0)
                ? controllerNameToLayout(layoutName)
                : layoutName;

            if (ViewsCache[filename]) {
                return;
            }

            return this.getLayoutFile(filename, function (data) {
                var view = new View(data);
                ViewsCache[filename] = view;
            });
        },

        /**
         * Parse a layout as a View object
         * @param  {String}   filename      Layout path
         * @param  {Function} callback      Callback
         * @param  {Object}   callback.view Parsed View object
         * @return {void}
         */
        getViewObject: function (filename, callback) {
            if (ViewsCache[filename]) {
                return callback(ViewsCache[filename]);
            }

            this.getLayoutFile(filename, function (data) {
                var view = new View(data);
                ViewsCache[filename] = view;
                return callback(view);
            });
        },

        /**
         * Request a layout file
         * @param  {String}   filename      Filename without .html extension
         * @param  {Function} callback      Callback
         * @param  {Function} callback.data Layout content
         */
        getLayoutFile: function (filename, callback) {
            var debuggable = Config.get('debug'),
                xmlhttp,
                path;

            if (Caviar.runningOnWP()) {
                // Request for local path requires a special path when running
                // on Windows Phone 8 WebView
                path = "x-wmapp0:www/assets/layouts/" + filename + ".html";
            } else {
                path = "assets/layouts/" + filename + ".html";
            }

            if (!debuggable && LayoutCache.has(path)) {
                return callback(LayoutCache.get(path));
            }

            xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4) {
                    if (!Config.get('debug')) {
                        LayoutCache.set(path, xmlhttp.responseText);
                    }

                    return callback(xmlhttp.responseText);
                }
            };

            xmlhttp.open("GET", path, true);
            xmlhttp.send();

            return;
        }
    };

    return LayoutLoader;
});
