/// <reference path="Config.ts" />
module Caviar {
    var _storage : any, VERSION : string;

    // App version
    VERSION = Config.get('version');

    // localStorage polyfill
    _storage = window.localStorage || {
        setItem: function (key, value) {
            this[key] = value;
        },
        getItem: function (key) {
            return this[key];
        },
        removeItem: function (key) {
            delete this[key];
        }
    }

    /**
     * Versioned cache for layout files
     * @module Caviar.LayoutCache
     * @author Bruno Ziiê <http://github.com/brunoziie/>
     */
    export module LayoutCache {
        /**
         * Get a layout from cache
         * @param  {String} key Layout path
         * @return {String}
         */
        export function get (key) {
            var path = VERSION + '_' + key;
            return _storage.getItem(path);
        }

        /**
         * Add or override a layout into cache
         * @param {String} key   Layout path
         * @param {String} value Layout content
         */
        export function set (key, value) {
            var path = VERSION + '_' + key;
            return _storage.setItem(path, value);
        }

        /**
         * Remove a layout from cache
         * @param  {String} key Layout path
         * @return {void}
         */
        export function forget (key) {
            var path = VERSION + '_' + key;
            return _storage.removeItem(path);
        }

        /**
         * Check if a layout already exists into cache
         * @param  {String}  key Layout path
         * @return {Boolean}
         */
        export function has (key) {
            var path = VERSION + '_' + key;
            return _storage[path] !== undefined;
        }
    }
}