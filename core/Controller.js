/*global define:true*/
/**
 * Controller superclass.
 * This class will be used like a basic implementation that all controllers must to be
 * @module Caviar.Controller
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('Controller', ['IntentManager'], function (IntentManager) {
    var Controller;

    Controller = {
        /**
         * Controller name
         * @type {String}
         */
        name: null,

        /**
         * View element
         * @type {Object}
         */
        view: null,

        /**
         * Store data used by controller
         * @type {Object}
         */
        data: null,

        /**
         * Get a data stored on controller instance
         * @param  {String} key
         */
        get: function (key) {
            return this.data[key];
        },

        /**
         * Add/Update a data on controller
         * @param {String} key
         * @param {Mixed} value
         */
        set: function (key, value) {
            this.data[key] = value;
            return;
        },

        /**
         * Callback executed before call initialize method
         * @param {Object} intent The intent that generated the current instance
         * @return {void}
         */
        beforeInitialize: function (intent) {
            return;
        },

        /**
         * Init controller's settings
         * @param {Object} intent The intent that generated the current instance
         * @return {void}
         */
        initialize: function (intent) {
            return;
        },

        /**
         * Callback called when a controller instance back to front
         */
        onResume: function () {
            return;
        },

        /**
         * Callback called when a controller instance back to front
         */
        onLeave: function () {
            return;
        },

        /**
         * Callback called when a controller instance receives data from another
         * @param {Mixed} data Data sent by previous controller instance
         */
        onResult: function (data) {
            return;
        },

        /**
         * Alias to starts an intent
         * @param {Intent} intent
         */
        startIntent: function (intent) {
            return IntentManager.start(intent);
        },

        /**
         * Alias to starts an intent
         * @param {Mixed}
         */
        result: function (data) {
            return IntentManager.result(data);
        },

        /**
         * Get DOM element binded by controller
         */
        getViewElement: function () {
            return this.view.getElement();
        },

        /**
         * Set event listeners on view
         * @param  {String}   event    Event name
         * @param  {String}   selector Element selector
         * @param  {Function} callback Callback
         * @return {void}
         */
        listen: function (event, selector, callback) {
            var view = $(this.getViewElement());
            return view.on(event, selector, callback);
        },

        /**
         * Destroy controller's resources
         * @return {void}
         */
        destroy: function () {
            this.data = {};
            return;
        }
    };

    return Controller;
});