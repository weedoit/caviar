/**
 * Module with some utils
 * @module Caviar
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('Caviar', function () {
    var Caviar, globals, isWP;

    // Applications globals vars
    globals = {};

    // Checks if application are running on Windows Phone
    isWP = window.location.href.indexOf('x-wmapp0:') >= 0;

    Caviar = {
        globals: {
            /**
             * Get a variable of application global scope
             * @param {String} key
             */
            get: function (key) {
                return globals[key] || null;
            },

            /**
             * Add/update a application global scope variable
             * @param {String} key
             * @param {Mixed} value
             */
            set: function (key, value) {
                return globals[key] = value;
            }
        },

        /**
         * Main element
         * @type {DOMElement}
         */
        contentBox: document.querySelector('.caviar-stage-container'),

        /**
         * Implements a extends utils
         * @param  {Mixed}    superclass Object or function that will be extended
         * @param  {Mixed}    def        Object or function with override implementation
         * @return {Function}
         */
        extend: function (parent, child) {
            var ctor, extended, key, _c, _hasProp, _p;

            _hasProp = {}.hasOwnProperty;
            _p = this.isFunction(parent) ? new parent() : parent;
            _c = this.isFunction(child) ? new child() : child;

            extended = function () {};
            ctor = function () {};

            ctor.prototype = _p;
            extended.prototype = new ctor();

            for (key in _c) {
                if (_hasProp.call(_c, key)) {
                    extended.prototype[key] = _c[key];
                }
            }

            return extended;
        },

        /**
         * Merge multiples configs with previous configs set.
         * @param {Object} list Object with key-value pair configs list
         */
        merge: function (origin, target) {
            var hasProp = {}.hasOwnProperty,
                item;

            for (item in origin) {
                if (origin.hasOwnProperty(item)) {
                    target[item] = origin[item];
                }
            }

            return target;
        },

        /**
         * Checks if is as function
         * @param  {Mixed}  arg 
         * @return {Boolean}
         */
        isFunction: function (arg) {
            return typeof arg === 'function';
        },

        /**
         * Checks if application are running on Windows Phone
         * @return {Boolean} [description]
         */
        runningOnWP: function () {
            return isWP;
        },

        /**
         * Exit from app
         */
        exit: function () {
            if (navigator.app) {
                return navigator.app.exitApp();
            } else if (navigator.device) {
                return navigator.device.exitApp();
            } else {
                return console.log('[Caviar] Application supposed to be ended');
            }
        }
    }

    return Caviar;
});
