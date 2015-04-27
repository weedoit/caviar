/*global define:true, window:true*/
/**
 * Versioned cache for layout files
 * @module Caviar.LayoutCache
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('LayoutCache', ['Config'], function (Config) {
    var VERSION,
        LayoutCache,
        localStorage;

    // App version
    VERSION = Config.get('version');

    // polyfill to localStorage
    localStorage = window.localStorage || {
        setItem: function (key, value) {
            this[key] = value;
        },
        getItem: function (key) {
            return this[key];
        },
        removeItem: function (key) {
            delete this[key];
        }
    };

    LayoutCache = {
        /**
         * Get a layout from cache
         * @param  {String} key Layout path
         * @return {String}
         */
        get: function (key) {
            var path = VERSION + '_' + key;
            return localStorage.getItem(path);
        },

        /**
         * Add or override a layout into cache
         * @param {String} key   Layout path
         * @param {String} value Layout content
         */
        set: function (key, value) {
            var path = VERSION + '_' + key;
            return localStorage.setItem(path, value);
        },

        /**
         * Remove a layout from cache
         * @param  {String} key Layout path
         * @return {void}
         */
        forget: function (key) {
            var path = VERSION + '_' + key;
            return localStorage.removeItem(path);
        },

        /**
         * Check if a layout already exists into cache
         * @param  {String}  key Layout path
         * @return {Boolean}
         */
        has: function (key) {
            var path = VERSION + '_' + key;
            return localStorage[path] !== undefined;
        }
    };

    return LayoutCache;
});
